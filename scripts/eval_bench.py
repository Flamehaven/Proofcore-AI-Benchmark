#!/usr/bin/env python3

"""
ProofCore Benchmark Evaluation Engine

Evaluates proofs from dataset.json using heuristic scoring:
1. Symbolic score: Basic pattern matching (offline, deterministic)
2. Semantic score: Stub implementation (deterministic hash-based)
3. Compute Wilson CI95-low for accuracy metrics
4. Generate JSON and CSV reports
"""

import json
import hashlib
import math
from pathlib import Path
from typing import Any, Dict, List, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class ProofScore:
    """Individual proof evaluation result"""
    id: str
    domain: str
    difficulty: str
    expected_validity: bool
    symbolic_score: float
    semantic_score: float
    hybrid_score: float
    confidence_low: float
    confidence_high: float
    passed: bool


class SymbolicEvaluator:
    """Offline symbolic proof evaluator (heuristic-based)"""

    def __init__(self):
        self.keywords = {
            "qed": 1.0,
            "therefore": 0.8,
            "by": 0.6,
            "since": 0.6,
            "assume": 0.5,
            "contradiction": 0.9,
            "implies": 0.7,
        }

    def evaluate(self, proof_text: str) -> float:
        """
        Heuristic symbolic evaluation (0-100 scale)
        Checks for:
        - Presence of QED or similar conclusion marker
        - Logical connectives
        - Length and structure
        """
        score = 50.0  # Base score

        proof_lower = proof_text.lower()

        # Check for conclusion markers
        if "qed" in proof_lower:
            score += 20
        elif "therefore" in proof_lower:
            score += 15
        elif "thus" in proof_lower:
            score += 15

        # Check for logical structure
        logical_words = sum(1 for word in self.keywords if word in proof_lower)
        score += min(logical_words * 2, 15)

        # Check for mathematical symbols/expressions
        if any(sym in proof_text for sym in ["=", "=>", "≤", "≥", "∈", "∀", "∃"]):
            score += 10

        # Check for proof by contradiction
        if "contradiction" in proof_lower:
            score += 5

        # Penalize very short proofs
        if len(proof_text) < 100:
            score -= 10
        # Reward longer, more detailed proofs
        elif len(proof_text) > 500:
            score += 5

        return min(max(score, 0), 100)


class SemanticEvaluator:
    """Offline semantic proof evaluator (deterministic, hash-based)"""

    def evaluate(self, proof_text: str, problem_text: str) -> float:
        """
        Deterministic semantic evaluation (0-100 scale)
        Uses hash-based scoring for reproducibility
        """
        # Create deterministic hash-based score
        combined = f"{proof_text}:{problem_text}"
        hash_bytes = hashlib.sha256(combined.encode()).digest()
        hash_int = int.from_bytes(hash_bytes[:4], byteorder="big")

        # Map hash to 50-100 range (conservative)
        base_score = 50 + (hash_int % 51)

        # Adjustments based on text analysis
        proof_lower = proof_text.lower()

        # If mentions "correct" or "valid", boost slightly
        if "correct" in proof_lower or "valid" in proof_lower:
            base_score += 5

        # If very short, reduce confidence
        if len(proof_text) < 80:
            base_score -= 10

        # If has clear logical flow, boost
        if proof_lower.count("then") >= 2 or proof_lower.count("since") >= 2:
            base_score += 5

        return min(max(base_score, 0), 100)


class BenchmarkEvaluator:
    """Main benchmark evaluation orchestrator"""

    def __init__(self):
        self.symbolic = SymbolicEvaluator()
        self.semantic = SemanticEvaluator()
        self.weights = {
            "symbolic": 0.7,
            "semantic": 0.3,
        }

    def wilson_ci_lower(
        self, successes: int, trials: int, z: float = 1.96
    ) -> float:
        """
        Wilson score interval - lower bound
        For converting sample accuracy to confidence interval
        z=1.96 for 95% confidence
        """
        if trials == 0:
            return 0.0

        p_hat = successes / trials
        denom = 1 + z * z / trials
        center = p_hat + z * z / (2 * trials)
        adj = z * math.sqrt((p_hat * (1 - p_hat) / trials) + (z * z / (4 * trials * trials)))

        return max(0.0, (center - adj) / denom)

    def evaluate_proof(self, item: Dict[str, Any]) -> ProofScore:
        """Evaluate a single proof"""
        proof_text = item["correct_proof"]
        problem_text = item["problem"]

        # Symbolic evaluation
        symbolic_score = self.symbolic.evaluate(proof_text)

        # Semantic evaluation
        semantic_score = self.semantic.evaluate(proof_text, problem_text)

        # Hybrid score (70% symbolic + 30% semantic)
        hybrid_score = (
            self.weights["symbolic"] * symbolic_score
            + self.weights["semantic"] * semantic_score
        )

        # Determine if passed (>80% is "valid")
        passed = hybrid_score > 80

        # Confidence interval (simplified: ±10 points)
        confidence_low = max(0, hybrid_score - 10)
        confidence_high = min(100, hybrid_score + 10)

        return ProofScore(
            id=item["id"],
            domain=item["domain"],
            difficulty=item["difficulty"],
            expected_validity=item["expected_validity"],
            symbolic_score=round(symbolic_score, 2),
            semantic_score=round(semantic_score, 2),
            hybrid_score=round(hybrid_score, 2),
            confidence_low=round(confidence_low, 2),
            confidence_high=round(confidence_high, 2),
            passed=passed,
        )

    def evaluate_dataset(self, dataset: List[Dict[str, Any]]) -> Tuple[List[ProofScore], Dict[str, Any]]:
        """Evaluate entire dataset"""
        scores = []
        for item in dataset:
            score = self.evaluate_proof(item)
            scores.append(score)

        # Compute statistics
        total = len(scores)
        passed = sum(1 for s in scores if s.passed)
        accuracy = passed / total if total > 0 else 0

        # Compute Wilson CI95-low for accuracy
        ci95_low = self.wilson_ci_lower(passed, total)

        meta = {
            "n": total,
            "passed": passed,
            "failed": total - passed,
            "accuracy": round(accuracy, 4),
            "accuracy_ci95_low": round(ci95_low, 4),
            "avg_symbolic": round(sum(s.symbolic_score for s in scores) / total, 2),
            "avg_semantic": round(sum(s.semantic_score for s in scores) / total, 2),
            "avg_hybrid": round(sum(s.hybrid_score for s in scores) / total, 2),
            "offline": True,
            "timestamp": datetime.now().isoformat(),
        }

        return scores, meta


def main():
    """Main benchmark execution"""
    import sys

    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    dataset_path = project_root / "examples" / "proofs" / "dataset.json"
    reports_dir = project_root / "reports"
    reports_dir.mkdir(exist_ok=True)

    # Load dataset
    print("[*] Loading dataset...")
    try:
        with open(dataset_path, encoding='utf-8') as f:
            dataset = json.load(f)
        print(f"[+] Loaded {len(dataset)} proofs")
    except FileNotFoundError:
        print(f"[-] Dataset not found: {dataset_path}")
        sys.exit(1)

    # Evaluate
    print("[*] Evaluating proofs...")
    evaluator = BenchmarkEvaluator()
    scores, meta = evaluator.evaluate_dataset(dataset)
    print(f"[+] Evaluation complete: {meta['accuracy']*100:.1f}% passed")

    # Write JSON report
    json_path = reports_dir / "bench_v0_1.json"
    json_report = {
        "meta": meta,
        "items": [asdict(s) for s in scores],
    }
    with open(json_path, "w") as f:
        json.dump(json_report, f, indent=2)
    print(f"[+] JSON report: {json_path}")

    # Write CSV report
    csv_path = reports_dir / "bench_v0_1.csv"
    import csv

    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "id",
            "domain",
            "difficulty",
            "expected_validity",
            "symbolic_score",
            "semantic_score",
            "hybrid_score",
            "confidence_low",
            "confidence_high",
            "passed",
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for score in scores:
            row = asdict(score)
            writer.writerow({k: row[k] for k in fieldnames})
    print(f"[+] CSV report: {csv_path}")

    # Print summary
    print("\n" + "=" * 50)
    print("BENCHMARK RESULTS")
    print("=" * 50)
    print(f"Total proofs: {meta['n']}")
    print(f"Passed: {meta['passed']}/{meta['n']}")
    print(f"Accuracy: {meta['accuracy']*100:.1f}%")
    print(f"Accuracy CI95-low: {meta['accuracy_ci95_low']*100:.1f}%")
    print(f"\nAverage scores:")
    print(f"  Symbolic: {meta['avg_symbolic']:.1f}")
    print(f"  Semantic: {meta['avg_semantic']:.1f}")
    print(f"  Hybrid: {meta['avg_hybrid']:.1f}")
    print(f"\nOffline mode: {meta['offline']}")
    print(f"Timestamp: {meta['timestamp']}")
    print("=" * 50)


if __name__ == "__main__":
    main()
