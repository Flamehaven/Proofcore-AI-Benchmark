#!/usr/bin/env python3
"""
ProofCore v1.0.0 Migration - Phase Validator

Validates that each phase of the migration has completed successfully.
Can be used to resume from interruptions.

Usage:
    python tests/phase_validator.py --phase 1 --full       # Full Phase 1 validation
    python tests/phase_validator.py --phase 1 --quick      # Quick status check
    python tests/phase_validator.py --resume               # Resume from last state
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime


@dataclass
class ValidationResult:
    """Result of a single validation check"""
    name: str
    passed: bool
    message: str
    timestamp: str


class PhaseValidator:
    """Validates migration phases and manages state checkpoints"""

    STATE_FILE = Path(".proofcore-state.json")
    PHASE_REPORT = Path("PHASE_{}_DISCOVERY_REPORT.md")

    def __init__(self):
        self.state = self._load_state()
        self.results: List[ValidationResult] = []

    def _load_state(self) -> Dict:
        """Load current migration state"""
        if self.STATE_FILE.exists():
            try:
                with open(self.STATE_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                print(f"[!] ERROR: .proofcore-state.json issue: {str(e)}")
                return {}
        return {}

    def _save_state(self):
        """Save current migration state"""
        with open(self.STATE_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, indent=2, ensure_ascii=True)

    def validate_phase_1(self, full: bool = True) -> Tuple[bool, str]:
        """
        Validate Phase 1: Discovery & Audit

        Checks:
        - [1.1] Code inventory files exist
        - [1.2] Dependency files readable
        - [1.3] Architecture documentation exists
        - [1.4] State checkpoint valid
        """
        checks = []

        # 1.1: Code Inventory
        check_1_1 = self._check_code_inventory()
        checks.append(check_1_1)

        # 1.2: Dependencies
        check_1_2 = self._check_dependencies()
        checks.append(check_1_2)

        # 1.3: Architecture
        check_1_3 = self._check_architecture()
        checks.append(check_1_3)

        # 1.4: State Checkpoint
        check_1_4 = self._check_state_checkpoint()
        checks.append(check_1_4)

        all_passed = all(c.passed for c in checks)
        summary = self._format_results(checks)

        return all_passed, summary

    def _check_code_inventory(self) -> ValidationResult:
        """Check [1.1] Code Inventory Scan"""
        try:
            # Frontend
            ts_files = list(Path("src").glob("**/*.ts")) + list(Path("src").glob("**/*.tsx"))
            ts_count = len(ts_files)

            # Backend
            py_files = list(Path("backend").glob("**/*.py")) if Path("backend").exists() else []
            py_count = len([f for f in py_files if "__pycache__" not in str(f)])

            # Check critical engines
            critical_files = [
                "src/core/proof_engine.ts",
                "src/core/symbolic_verifier.ts",
                "src/core/semantic_evaluator.ts",
                "backend/app/services/verification.py" if Path("backend").exists() else None,
            ]
            critical_missing = [f for f in critical_files if f and not Path(f).exists()]

            passed = ts_count > 50 and py_count > 15 and not critical_missing
            message = f"TS: {ts_count}, PY: {py_count}, Critical files: {'OK' if not critical_missing else 'MISSING'}"

            return ValidationResult(
                name="[1.1] Code Inventory Scan",
                passed=passed,
                message=message,
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return ValidationResult(
                name="[1.1] Code Inventory Scan",
                passed=False,
                message=f"ERROR: {str(e)}",
                timestamp=datetime.now().isoformat()
            )

    def _check_dependencies(self) -> ValidationResult:
        """Check [1.2] Dependency Analysis"""
        try:
            # Check package.json
            package_exists = Path("package.json").exists()
            package_readable = False
            npm_deps_ok = False

            if package_exists:
                try:
                    with open("package.json") as f:
                        pkg = json.load(f)
                    package_readable = True
                    # Check critical deps
                    deps = pkg.get("dependencies", {})
                    npm_deps_ok = all(k in deps for k in ["react", "d3", "@tanstack/react-query"])
                except json.JSONDecodeError:
                    pass

            # Check pyproject.toml
            pyproject_exists = Path("pyproject.toml").exists()

            passed = package_exists and package_readable and npm_deps_ok and pyproject_exists
            message = f"package.json: {'OK' if package_readable else 'UNREADABLE'}, pyproject.toml: {'OK' if pyproject_exists else 'MISSING'}"

            return ValidationResult(
                name="[1.2] Dependency Analysis",
                passed=passed,
                message=message,
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return ValidationResult(
                name="[1.2] Dependency Analysis",
                passed=False,
                message=f"ERROR: {str(e)}",
                timestamp=datetime.now().isoformat()
            )

    def _check_architecture(self) -> ValidationResult:
        """Check [1.3] Architecture Mapping"""
        try:
            report_exists = Path("PHASE_1_DISCOVERY_REPORT.md").exists()
            report_readable = False
            report_complete = False

            if report_exists:
                try:
                    content = Path("PHASE_1_DISCOVERY_REPORT.md").read_text(encoding='utf-8')
                    report_readable = True
                    # Check for key sections
                    sections = [
                        "Executive Summary",
                        "Phase 1 Substep 1.1: Code Inventory Scan",
                        "Phase 1 Substep 1.2: Dependency Analysis",
                        "Architecture Mapping",
                    ]
                    report_complete = all(s in content for s in sections)
                except Exception:
                    pass

            passed = report_exists and report_readable and report_complete
            message = f"Report: {'COMPLETE' if report_complete else 'INCOMPLETE' if report_readable else 'UNREADABLE'}"

            return ValidationResult(
                name="[1.3] Architecture Mapping",
                passed=passed,
                message=message,
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return ValidationResult(
                name="[1.3] Architecture Mapping",
                passed=False,
                message=f"ERROR: {str(e)}",
                timestamp=datetime.now().isoformat()
            )

    def _check_state_checkpoint(self) -> ValidationResult:
        """Check [1.4] State Checkpoint Creation"""
        try:
            state_exists = self.STATE_FILE.exists()
            state_valid = False
            state_content = ""

            if state_exists:
                try:
                    state_data = json.loads(self.STATE_FILE.read_text())
                    state_valid = (
                        "migration" in state_data and
                        "phase_checkpoint" in state_data["migration"] and
                        state_data["migration"].get("status") == "PHASE_1_DISCOVERY"
                    )
                    state_content = state_data.get("migration", {}).get("status", "UNKNOWN")
                except json.JSONDecodeError:
                    pass

            passed = state_exists and state_valid
            message = f"State file: {'VALID' if state_valid else 'INVALID' if state_exists else 'MISSING'} (Status: {state_content})"

            return ValidationResult(
                name="[1.4] State Checkpoint",
                passed=passed,
                message=message,
                timestamp=datetime.now().isoformat()
            )
        except Exception as e:
            return ValidationResult(
                name="[1.4] State Checkpoint",
                passed=False,
                message=f"ERROR: {str(e)}",
                timestamp=datetime.now().isoformat()
            )

    def _format_results(self, results: List[ValidationResult]) -> str:
        """Format validation results as human-readable string"""
        lines = ["\n" + "="*70]
        lines.append("PROOFCORE MIGRATION - PHASE VALIDATION REPORT")
        lines.append("="*70 + "\n")

        for result in results:
            status_icon = "[+]" if result.passed else "[-]"
            lines.append(f"{status_icon} {result.name}")
            lines.append(f"    {result.message}")
            lines.append(f"    Checked: {result.timestamp}\n")

        passed_count = sum(1 for r in results if r.passed)
        lines.append("="*70)
        lines.append(f"SUMMARY: {passed_count}/{len(results)} checks passed")
        lines.append("="*70 + "\n")

        return "\n".join(lines)

    def get_current_phase(self) -> str:
        """Get current migration phase from state"""
        status = self.state.get("migration", {}).get("status", "UNKNOWN")
        return status

    def get_resume_point(self) -> Optional[str]:
        """Get next task to resume from after interruption"""
        status = self.state.get("migration", {}).get("status")

        resume_points = {
            "PHASE_1_DISCOVERY": "Phase 1 complete; ready for Phase 2",
            "PHASE_2_BRANDING": "Phase 2 in progress; resume branding updates",
            "PHASE_3_CLEANUP": "Phase 3 in progress; resume architecture cleanup",
            "PHASE_4_INTEGRATION": "Phase 4 in progress; resume engine integration",
            "PHASE_5_TESTING": "Phase 5 in progress; resume testing",
            "COMPLETE": "Migration complete; ready for v1.0.0 release",
        }

        return resume_points.get(status, f"Unknown phase: {status}")


def main():
    """CLI entry point"""
    import argparse

    parser = argparse.ArgumentParser(
        description="ProofCore Migration Phase Validator"
    )
    parser.add_argument("--phase", type=int, choices=[1, 2, 3, 4, 5],
                        help="Validate specific phase")
    parser.add_argument("--full", action="store_true",
                        help="Run full validation (default: quick check)")
    parser.add_argument("--resume", action="store_true",
                        help="Show resume point if session was interrupted")

    args = parser.parse_args()

    validator = PhaseValidator()

    if args.resume:
        print(f"\nCurrent phase: {validator.get_current_phase()}")
        print(f"Resume point: {validator.get_resume_point()}\n")
        return 0

    if args.phase == 1:
        passed, report = validator.validate_phase_1(full=args.full)
        print(report)
        return 0 if passed else 1

    # Default: show current status
    print(f"Current migration phase: {validator.get_current_phase()}")
    print(f"Resume from: {validator.get_resume_point()}")
    print("\nRun with --phase 1 --full for full validation")
    return 0


if __name__ == "__main__":
    sys.exit(main())
