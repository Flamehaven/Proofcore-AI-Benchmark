"""[*] Performance tests for LLM system"""

import pytest
import time
import json
from app.services.llm.base import LLMUsage
from app.services.llm.cost_tracker import CostTracker


class TestCostCalculationPerformance:
    """Test cost calculation performance"""

    def test_single_calculation_speed(self):
        """Test single cost calculation is fast"""
        tracker = CostTracker(provider="anthropic")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        start = time.time()
        cost = tracker.calculate("claude-3-5-sonnet-20240620", usage)
        elapsed = time.time() - start

        assert cost > 0
        assert elapsed < 0.01  # < 10ms

    def test_bulk_calculations_performance(self):
        """Test bulk cost calculations"""
        tracker = CostTracker(provider="openai")
        usage_list = [
            LLMUsage(prompt_tokens=i*100, completion_tokens=i*50, total_tokens=i*150)
            for i in range(1, 101)  # 100 calls
        ]

        start = time.time()
        for usage in usage_list:
            tracker.calculate("gpt-4o-2024-05-13", usage)
        elapsed = time.time() - start

        assert tracker.call_count == 100
        assert elapsed < 1.0  # < 1 second for 100 calls

    def test_statistics_calculation_speed(self):
        """Test statistics calculation speed"""
        tracker = CostTracker(provider="google")

        for _ in range(50):
            usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
            tracker.calculate("gemini-1.5-pro", usage)

        start = time.time()
        stats = tracker.get_stats()
        elapsed = time.time() - start

        assert stats['call_count'] == 50
        assert elapsed < 0.001  # < 1ms


class TestJSONParsingPerformance:
    """Test response parsing performance"""

    def test_json_parse_speed(self):
        """Test JSON parsing speed"""
        response = '{"score": 85, "reasoning": "Good proof structure with valid logic"}'

        start = time.time()
        for _ in range(1000):
            data = json.loads(response)
            score = data.get('score', 50)
        elapsed = time.time() - start

        assert elapsed < 0.1  # < 100ms for 1000 parses

    def test_regex_fallback_speed(self):
        """Test regex fallback parsing speed"""
        import re
        response = "The proof score: 78. This demonstrates sound reasoning."

        start = time.time()
        for _ in range(1000):
            match = re.search(r'score[:\s]+(\d+)', response, re.IGNORECASE)
            score = int(match[1]) if match else 50
        elapsed = time.time() - start

        assert elapsed < 0.5  # < 500ms for 1000 parses


class TestMemoryEfficiency:
    """Test memory efficiency"""

    def test_tracker_memory_usage(self):
        """Test tracker memory doesn't grow unbounded"""
        tracker = CostTracker(provider="anthropic")

        # Create many usages
        usage_list = [
            LLMUsage(prompt_tokens=i, completion_tokens=i//2, total_tokens=int(i*1.5))
            for i in range(1, 10001)
        ]

        for usage in usage_list:
            tracker.calculate("claude-3-5-sonnet-20240620", usage)

        stats = tracker.get_stats()
        assert stats['call_count'] == 10000
        # Stats should be simple aggregates
        assert len(stats) == 4


class TestConcurrencyBehavior:
    """Test concurrent access patterns"""

    def test_multiple_trackers_isolation(self):
        """Test multiple trackers don't interfere"""
        trackers = [
            CostTracker(provider="anthropic"),
            CostTracker(provider="openai"),
            CostTracker(provider="google")
        ]

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        for i, tracker in enumerate(trackers):
            for j in range(100):
                if tracker.provider == "anthropic":
                    model = "claude-3-5-sonnet-20240620"
                elif tracker.provider == "openai":
                    model = "gpt-4o-2024-05-13"
                else:
                    model = "gemini-1.5-pro"

                tracker.calculate(model, usage)

        # Verify isolation
        for tracker in trackers:
            assert tracker.call_count == 100


class TestLargeScaleOperations:
    """Test performance at scale"""

    def test_day_simulation_1000_calls(self):
        """Simulate 1000 calls in a day"""
        tracker = CostTracker(provider="openai")

        start = time.time()
        for i in range(1000):
            usage = LLMUsage(
                prompt_tokens=500 + (i % 500),
                completion_tokens=250 + (i % 250),
                total_tokens=750 + (i % 750)
            )
            tracker.calculate("gpt-4o-2024-05-13", usage)
        elapsed = time.time() - start

        stats = tracker.get_stats()
        assert stats['call_count'] == 1000
        assert elapsed < 2.0  # Should complete in under 2 seconds

    def test_monthly_cost_aggregation(self):
        """Test monthly cost aggregation"""
        tracker = CostTracker(provider="anthropic")

        # 30 days * 100 calls/day = 3000 calls
        for day in range(30):
            for call in range(100):
                usage = LLMUsage(
                    prompt_tokens=1000,
                    completion_tokens=500,
                    total_tokens=1500
                )
                tracker.calculate("claude-3-5-sonnet-20240620", usage)

        stats = tracker.get_stats()
        assert stats['call_count'] == 3000
        assert stats['total_cost'] > 0
        assert stats['average_cost'] > 0


class TestResetPerformance:
    """Test reset operation performance"""

    def test_reset_after_large_dataset(self):
        """Test reset is fast even with large data"""
        tracker = CostTracker(provider="google")

        for _ in range(5000):
            usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
            tracker.calculate("gemini-1.5-pro", usage)

        start = time.time()
        tracker.reset()
        elapsed = time.time() - start

        assert tracker.call_count == 0
        assert tracker.total_cost == 0.0
        assert elapsed < 0.001  # < 1ms


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
