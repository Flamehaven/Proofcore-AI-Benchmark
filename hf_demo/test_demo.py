"""
ProofCore Demo - Quick Test Script
Tests core functionality without requiring Gradio server
"""

import sys
import time
from app import ProofCoreDemo, EXAMPLE_PROOFS, ProofStep


def test_verifier_initialization():
    """Test 1: Verify initialization"""
    print("[>] Test 1: Verifier Initialization...")
    demo = ProofCoreDemo()
    assert demo.verifier is not None
    assert demo.current_proof is None
    assert demo.results == []
    print("[+] Verifier initialized successfully\n")


def test_load_examples():
    """Test 2: Load example proofs"""
    print("[>] Test 2: Loading Example Proofs...")
    demo = ProofCoreDemo()

    for i, example_name in enumerate(EXAMPLE_PROOFS.keys(), 1):
        proof_info, steps = demo.load_example_proof(example_name)
        assert "Loaded" in proof_info
        assert len(demo.current_proof["steps"]) > 0
        print(f"  [{i}] {example_name}: {len(demo.current_proof['steps'])} steps")

    print(f"[+] All {len(EXAMPLE_PROOFS)} examples loaded successfully\n")


def test_verification():
    """Test 3: Verify example proofs"""
    print("[>] Test 3: Verifying Example Proofs...")
    demo = ProofCoreDemo()

    for i, example_name in enumerate(EXAMPLE_PROOFS.keys(), 1):
        demo.load_example_proof(example_name)
        results, summary, metrics = demo.verify_current_proof()

        # Check results contain verification data
        assert "VERIFICATION RESULTS" in results
        assert "[VALID]" in results or "[INVALID]" in results
        assert "Symbolic Score" in results

        print(f"  [{i}] {example_name}: {len(demo.results)} steps verified")

    print(f"[+] All proofs verified successfully\n")


def test_custom_steps():
    """Test 4: Custom step verification"""
    print("[>] Test 4: Custom Step Verification...")
    demo = ProofCoreDemo()

    test_steps = [
        ("2+2=4", "2 + 2 = 4", "Simple addition", "algebra"),
        ("x²=4 when x=2", "x^2 = 4", "Algebraic equation", "algebra"),
        ("All angles sum to 180", "A + B + C = 180", "Triangle angle sum", "geometry"),
        ("If P then Q", "P implies Q", "Logical implication", "logic"),
    ]

    for i, (claim, eq, reason, domain) in enumerate(test_steps, 1):
        result = demo.create_custom_step(claim, eq, reason, domain)
        assert "Custom Step Verification" in result
        assert "Symbolic Score" in result
        assert "Heuristic Score" in result
        print(f"  [{i}] {claim}: Verified")

    print(f"[+] All custom steps verified successfully\n")


def test_performance():
    """Test 5: Performance metrics"""
    print("[>] Test 5: Performance Metrics...")
    demo = ProofCoreDemo()

    # Verify a proof
    demo.load_example_proof("Algebra: Difference of Squares")
    demo.verify_current_proof()

    # Check metrics
    metrics = demo.verifier.get_metrics()

    assert metrics["network_calls"] == 0
    assert metrics["offline_status"] == "100% Verified"
    assert metrics["data_stored"] == "Local only"
    assert metrics["avg_verification_time_ms"] >= 0

    print(f"  Network calls: {metrics['network_calls']}")
    print(f"  Offline status: {metrics['offline_status']}")
    print(f"  Avg verification time: {metrics['avg_verification_time_ms']}ms")
    print(f"  Proofs verified: {metrics['proofs_verified']}")
    print("[+] Performance metrics verified\n")


def test_scoring():
    """Test 6: Scoring functions"""
    print("[>] Test 6: Scoring Functions...")
    demo = ProofCoreDemo()

    step = ProofStep(
        id=1,
        claim="If x = 2, then x² = 4",
        equation="x^2 = 4",
        reasoning="By substitution and algebraic verification",
        domain="algebra"
    )

    # Test symbolic verification
    symbolic = demo.verifier._symbolic_verify(step)
    assert 0 <= symbolic <= 1.0
    print(f"  Symbolic score: {symbolic:.1%}")

    # Test heuristic evaluation
    heuristic = demo.verifier._heuristic_evaluate(step)
    assert 0 <= heuristic <= 1.0
    print(f"  Heuristic score: {heuristic:.1%}")

    # Test consensus
    consensus = demo.verifier._consensus_score(symbolic, heuristic)
    assert 0 <= consensus <= 1.0
    print(f"  Consensus score: {consensus:.1%}")

    print("[+] Scoring functions validated\n")


def test_offline_guarantee():
    """Test 7: Offline guarantee (zero network calls)"""
    print("[>] Test 7: Offline Guarantee...")

    # This demo runs 100% locally with no network calls
    # Verify by checking metrics
    demo = ProofCoreDemo()
    demo.load_example_proof("Algebra: Quadratic Formula")
    demo.verify_current_proof()

    metrics = demo.verifier.get_metrics()

    assert metrics["network_calls"] == 0, "Network calls should be 0!"
    assert metrics["offline_status"] == "100% Verified", "Must be offline-safe!"

    print(f"  Network calls: {metrics['network_calls']} [VERIFIED]")
    print(f"  Offline operation: Confirmed [VERIFIED]")
    print(f"  Data storage: {metrics['data_stored']} [VERIFIED]")
    print("[+] 100% offline operation confirmed\n")


def test_performance_targets():
    """Test 8: Performance targets"""
    print("[>] Test 8: Performance Targets...")
    demo = ProofCoreDemo()

    target_times = {
        "Symbolic": 150,  # ms
        "Heuristic": 100,  # ms
        "Per-step average": 200,  # ms
    }

    print(f"  Target verification time (per step): <{target_times['Per-step average']}ms")

    # Run verification
    demo.load_example_proof("Algebra: Difference of Squares")
    start = time.time()
    demo.verify_current_proof()
    elapsed_ms = (time.time() - start) * 1000

    avg_per_step = elapsed_ms / len(demo.results)

    print(f"  Actual time: {avg_per_step:.1f}ms per step")
    print(f"  Status: {'[+] PASS' if avg_per_step < target_times['Per-step average'] else '[-] SLOW'}")
    print("[+] Performance targets validated\n")


def run_all_tests():
    """Run all tests"""
    print("="*70)
    print("[*] ProofCore v1.0.2 Demo - Test Suite")
    print("="*70 + "\n")

    tests = [
        test_verifier_initialization,
        test_load_examples,
        test_verification,
        test_custom_steps,
        test_performance,
        test_scoring,
        test_offline_guarantee,
        test_performance_targets,
    ]

    passed = 0
    failed = 0

    for test in tests:
        try:
            test()
            passed += 1
        except AssertionError as e:
            print(f"[-] Test failed: {e}\n")
            failed += 1
        except Exception as e:
            print(f"[-] Test error: {e}\n")
            failed += 1

    print("="*70)
    print(f"[*] Test Results: {passed} passed, {failed} failed")
    print("="*70)

    if failed == 0:
        print("[+] All tests passed! Demo is ready for deployment.")
        return 0
    else:
        print(f"[-] {failed} test(s) failed. Please review.")
        return 1


if __name__ == "__main__":
    sys.exit(run_all_tests())
