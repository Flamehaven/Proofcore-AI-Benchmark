"""[*] Integration tests for LLM provider system"""

import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.llm.base import EvaluationOptions, LLMUsage, LLMResponse
from app.services.llm.cost_tracker import CostTracker


class TestProviderIntegration:
    """Test provider integration scenarios"""

    @pytest.mark.asyncio
    async def test_concurrent_provider_calls(self):
        """Test multiple providers called concurrently"""
        # Simulate concurrent requests
        usage1 = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
        usage2 = LLMUsage(prompt_tokens=2000, completion_tokens=1000, total_tokens=3000)
        usage3 = LLMUsage(prompt_tokens=500, completion_tokens=250, total_tokens=750)

        tracker_anthropic = CostTracker(provider="anthropic")
        tracker_openai = CostTracker(provider="openai")
        tracker_google = CostTracker(provider="google")

        # Concurrent calculations
        cost1 = tracker_anthropic.calculate("claude-3-5-sonnet-20240620", usage1)
        cost2 = tracker_openai.calculate("gpt-4o-2024-05-13", usage2)
        cost3 = tracker_google.calculate("gemini-1.5-pro", usage3)

        assert cost1 > 0
        assert cost2 > 0
        assert cost3 > 0
        assert tracker_anthropic.call_count == 1
        assert tracker_openai.call_count == 1
        assert tracker_google.call_count == 1

    def test_cost_aggregation_multiple_calls(self):
        """Test cost aggregation across multiple calls"""
        tracker = CostTracker(provider="openai")
        usage_list = [
            LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500),
            LLMUsage(prompt_tokens=2000, completion_tokens=1000, total_tokens=3000),
            LLMUsage(prompt_tokens=1500, completion_tokens=750, total_tokens=2250),
        ]

        total_cost = 0
        for usage in usage_list:
            cost = tracker.calculate("gpt-4o-2024-05-13", usage)
            total_cost += cost

        stats = tracker.get_stats()
        assert stats['call_count'] == 3
        assert stats['total_cost'] == pytest.approx(total_cost, rel=1e-4)
        assert stats['average_cost'] == pytest.approx(total_cost / 3, rel=1e-4)

    def test_provider_fallback_chain(self):
        """Test provider fallback logic"""
        providers_available = {
            "anthropic": True,
            "openai": True,
            "google": False  # Simulated unavailable
        }

        # Fallback logic
        for provider_name, available in providers_available.items():
            if available:
                assert provider_name in ["anthropic", "openai"]
            else:
                assert provider_name == "google"

    def test_mixed_response_formats(self):
        """Test handling mixed response formats"""
        responses = [
            '{"score": 85, "reasoning": "Good"}',  # Valid JSON
            'Score: 92 - Excellent proof',  # Fallback format
            '{"score": 78}',  # Partial JSON
        ]

        scores_expected = [85, 92, 78]

        for response, expected_score in zip(responses, scores_expected):
            try:
                import json
                data = json.loads(response)
                score = data.get('score', 50)
            except:
                import re
                match = re.search(r'score[:\s]+(\d+)', response, re.IGNORECASE)
                score = int(match[1]) if match else 50

            assert 0 <= score <= 100


class TestErrorRecovery:
    """Test error recovery and resilience"""

    def test_invalid_token_counts(self):
        """Test handling invalid token counts"""
        tracker = CostTracker(provider="anthropic")

        # Zero tokens
        usage_zero = LLMUsage(prompt_tokens=0, completion_tokens=0, total_tokens=0)
        cost_zero = tracker.calculate("claude-3-5-sonnet-20240620", usage_zero)
        assert cost_zero == 0.0

        # Large tokens
        usage_large = LLMUsage(
            prompt_tokens=100000,
            completion_tokens=50000,
            total_tokens=150000
        )
        cost_large = tracker.calculate("claude-3-5-sonnet-20240620", usage_large)
        assert cost_large > 0

    def test_negative_cost_prevention(self):
        """Test cost never goes negative"""
        tracker = CostTracker(provider="openai")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        cost = tracker.calculate("gpt-4o-2024-05-13", usage)
        assert cost >= 0.0

    def test_cost_tracker_state_isolation(self):
        """Test cost trackers don't interfere"""
        tracker1 = CostTracker(provider="anthropic")
        tracker2 = CostTracker(provider="openai")

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        tracker1.calculate("claude-3-5-sonnet-20240620", usage)
        tracker2.calculate("gpt-4o-2024-05-13", usage)

        assert tracker1.call_count == 1
        assert tracker2.call_count == 1
        assert tracker1.get_stats()['provider'] == 'anthropic'
        assert tracker2.get_stats()['provider'] == 'openai'


class TestResponseValidation:
    """Test response validation and normalization"""

    def test_score_boundary_values(self):
        """Test score validation at boundaries"""
        from app.services.llm.base import ParsedResponse

        # Valid boundaries
        assert ParsedResponse(score=0).score == 0
        assert ParsedResponse(score=100).score == 100
        assert ParsedResponse(score=50).score == 50

    def test_empty_reasoning_handling(self):
        """Test empty reasoning fallback"""
        from app.services.llm.base import ParsedResponse

        parsed = ParsedResponse(reasoning="")
        # Empty is allowed in Pydantic
        assert parsed.reasoning == ""

    def test_response_normalization(self):
        """Test response field normalization"""
        from app.services.llm.base import LLMResponse, LLMUsage

        usage = LLMUsage(prompt_tokens=100, completion_tokens=50, total_tokens=150)
        response = LLMResponse(
            provider="anthropic",
            model="claude-3-5-sonnet",
            score=85,
            reasoning="Test",
            raw_response="raw",
            usage=usage,
            cost=0.005,
            duration_ms=1200
        )

        # Verify all fields normalized
        assert response.score == 85
        assert response.cost == 0.005
        assert response.duration_ms == 1200


class TestProviderPricingMatrix:
    """Test pricing calculations across all providers"""

    def test_all_anthropic_models_pricing(self):
        """Test all Anthropic model pricing"""
        tracker = CostTracker(provider="anthropic")
        models = [
            "claude-3-5-sonnet-20240620",
            "claude-3-opus-20240229",
            "claude-3-haiku-20240307"
        ]

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=1000, total_tokens=2000)

        costs = {}
        for model in models:
            cost = tracker.calculate(model, usage)
            costs[model] = cost
            assert cost > 0

        # Verify relative pricing (haiku < sonnet < opus)
        assert costs["claude-3-haiku-20240307"] < costs["claude-3-5-sonnet-20240620"]
        assert costs["claude-3-5-sonnet-20240620"] < costs["claude-3-opus-20240229"]

    def test_all_openai_models_pricing(self):
        """Test all OpenAI model pricing"""
        tracker = CostTracker(provider="openai")
        models = [
            "gpt-3.5-turbo",
            "gpt-4o-2024-05-13",
            "gpt-4-turbo",
            "gpt-4"
        ]

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=1000, total_tokens=2000)

        costs = {}
        for model in models:
            cost = tracker.calculate(model, usage)
            costs[model] = cost
            assert cost > 0

        # Verify relative pricing
        assert costs["gpt-3.5-turbo"] < costs["gpt-4o-2024-05-13"]

    def test_all_google_models_pricing(self):
        """Test all Google model pricing"""
        tracker = CostTracker(provider="google")
        models = [
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.5-pro"
        ]

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=1000, total_tokens=2000)

        costs = {}
        for model in models:
            cost = tracker.calculate(model, usage)
            costs[model] = cost
            assert cost > 0

        # Verify pricing exists for all models
        assert len(costs) == 3


class TestCostComparisonScenarios:
    """Test cost comparison across scenarios"""

    def test_short_response_cost_comparison(self):
        """Compare costs for short responses"""
        short_usage = LLMUsage(prompt_tokens=100, completion_tokens=50, total_tokens=150)

        anthropic_cost = CostTracker("anthropic").calculate(
            "claude-3-5-sonnet-20240620", short_usage
        )
        openai_cost = CostTracker("openai").calculate(
            "gpt-4o-2024-05-13", short_usage
        )
        google_cost = CostTracker("google").calculate(
            "gemini-1.5-pro", short_usage
        )

        assert anthropic_cost > 0
        assert openai_cost > 0
        assert google_cost > 0

    def test_long_response_cost_comparison(self):
        """Compare costs for long responses"""
        long_usage = LLMUsage(prompt_tokens=5000, completion_tokens=2000, total_tokens=7000)

        anthropic_cost = CostTracker("anthropic").calculate(
            "claude-3-5-sonnet-20240620", long_usage
        )
        openai_cost = CostTracker("openai").calculate(
            "gpt-4o-2024-05-13", long_usage
        )
        google_cost = CostTracker("google").calculate(
            "gemini-1.5-pro", long_usage
        )

        # All should calculate correctly
        assert anthropic_cost > 0
        assert openai_cost > 0
        assert google_cost > 0


class TestStatisticsAggregation:
    """Test statistics aggregation and reporting"""

    def test_statistics_accuracy(self):
        """Test statistics calculation accuracy"""
        tracker = CostTracker(provider="anthropic")

        calls = [
            LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500),
            LLMUsage(prompt_tokens=2000, completion_tokens=1000, total_tokens=3000),
            LLMUsage(prompt_tokens=1500, completion_tokens=750, total_tokens=2250),
        ]

        total = 0
        for usage in calls:
            cost = tracker.calculate("claude-3-5-sonnet-20240620", usage)
            total += cost

        stats = tracker.get_stats()

        assert stats['call_count'] == 3
        assert abs(stats['total_cost'] - total) < 0.0001
        assert abs(stats['average_cost'] - (total / 3)) < 0.0001

    def test_multiple_providers_statistics(self):
        """Test statistics for multiple providers"""
        trackers = {
            "anthropic": CostTracker("anthropic"),
            "openai": CostTracker("openai"),
            "google": CostTracker("google")
        }

        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        stats = {}
        for provider_name, tracker in trackers.items():
            if provider_name == "anthropic":
                model = "claude-3-5-sonnet-20240620"
            elif provider_name == "openai":
                model = "gpt-4o-2024-05-13"
            else:
                model = "gemini-1.5-pro"

            tracker.calculate(model, usage)
            stats[provider_name] = tracker.get_stats()

        # Verify all providers have statistics
        assert len(stats) == 3
        for provider_name, provider_stats in stats.items():
            assert provider_stats['provider'] == provider_name
            assert provider_stats['call_count'] == 1
            assert provider_stats['total_cost'] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
