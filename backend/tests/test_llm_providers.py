"""[*] Unit tests for LLM providers (Anthropic, OpenAI, Google)"""

import pytest
import json
from unittest.mock import Mock, patch, AsyncMock
from typing import Any

# Import provider classes
from app.services.llm.base import (
    LLMResponse, EvaluationOptions, ParsedResponse, LLMUsage, BaseLLMProvider
)
from app.services.llm.cost_tracker import CostTracker


class TestCostTracker:
    """Test cost calculation for all providers"""

    def test_anthropic_cost_calculation(self):
        """Test Anthropic cost calculation"""
        tracker = CostTracker(provider="anthropic")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
        cost = tracker.calculate("claude-3-5-sonnet-20240620", usage)

        # Expected: (1000/1000)*0.003 + (500/1000)*0.015 = 0.003 + 0.0075 = 0.0105
        assert cost == pytest.approx(0.0105, rel=1e-4)
        assert tracker.call_count == 1
        assert tracker.total_cost == pytest.approx(0.0105, rel=1e-4)

    def test_openai_cost_calculation(self):
        """Test OpenAI cost calculation"""
        tracker = CostTracker(provider="openai")
        usage = LLMUsage(prompt_tokens=2000, completion_tokens=1000, total_tokens=3000)
        cost = tracker.calculate("gpt-4o-2024-05-13", usage)

        # Expected: (2000/1000)*0.005 + (1000/1000)*0.015 = 0.01 + 0.015 = 0.025
        assert cost == pytest.approx(0.025, rel=1e-4)

    def test_google_cost_calculation(self):
        """Test Google cost calculation"""
        tracker = CostTracker(provider="google")
        usage = LLMUsage(prompt_tokens=500, completion_tokens=250, total_tokens=750)
        cost = tracker.calculate("gemini-1.5-pro", usage)

        # Expected: (500/1000)*0.00125 + (250/1000)*0.005 = 0.000625 + 0.00125 = 0.001875
        assert cost == pytest.approx(0.001875, rel=1e-4)

    def test_cost_tracker_stats(self):
        """Test cost tracker statistics"""
        tracker = CostTracker(provider="anthropic")
        usage1 = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
        usage2 = LLMUsage(prompt_tokens=2000, completion_tokens=1000, total_tokens=3000)

        cost1 = tracker.calculate("claude-3-5-sonnet-20240620", usage1)
        cost2 = tracker.calculate("claude-3-5-sonnet-20240620", usage2)

        stats = tracker.get_stats()
        assert stats['provider'] == 'anthropic'
        assert stats['call_count'] == 2
        assert stats['total_cost'] == pytest.approx(cost1 + cost2, rel=1e-4)

    def test_unknown_model_pricing(self):
        """Test handling unknown model"""
        tracker = CostTracker(provider="anthropic")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
        cost = tracker.calculate("unknown-model", usage)

        assert cost == 0.0


class TestParsedResponse:
    """Test response parsing logic"""

    def test_json_response_parsing(self):
        """Test JSON response parsing"""
        response_text = '{"score": 85, "reasoning": "Proof is logically sound"}'
        parsed = ParsedResponse(**json.loads(response_text))

        assert parsed.score == 85
        assert parsed.reasoning == "Proof is logically sound"

    def test_invalid_json_default_values(self):
        """Test default values for invalid data"""
        parsed = ParsedResponse()
        assert parsed.score == 50
        assert parsed.reasoning == "No reasoning provided"

    def test_score_validation_range(self):
        """Test score range validation"""
        # Valid score
        parsed1 = ParsedResponse(score=0)
        assert parsed1.score == 0

        parsed2 = ParsedResponse(score=100)
        assert parsed2.score == 100

        parsed3 = ParsedResponse(score=50)
        assert parsed3.score == 50


class TestEvaluationOptions:
    """Test evaluation configuration"""

    def test_default_options(self):
        """Test default evaluation options"""
        opts = EvaluationOptions()
        assert opts.temperature == 0.3
        assert opts.max_tokens == 500
        assert opts.json_mode is True
        assert opts.model is None

    def test_custom_options(self):
        """Test custom evaluation options"""
        opts = EvaluationOptions(
            temperature=0.7,
            max_tokens=1000,
            json_mode=False,
            model="custom-model"
        )
        assert opts.temperature == 0.7
        assert opts.max_tokens == 1000
        assert opts.json_mode is False
        assert opts.model == "custom-model"


class TestLLMResponse:
    """Test LLM response model"""

    def test_llm_response_creation(self):
        """Test LLM response creation"""
        usage = LLMUsage(prompt_tokens=100, completion_tokens=50, total_tokens=150)
        response = LLMResponse(
            provider="anthropic",
            model="claude-3-5-sonnet",
            score=85,
            reasoning="Good proof",
            raw_response="raw text",
            usage=usage,
            cost=0.01,
            duration_ms=1500
        )

        assert response.provider == "anthropic"
        assert response.score == 85
        assert response.cost == 0.01
        assert response.duration_ms == 1500

    def test_llm_response_score_bounds(self):
        """Test LLM response score bounds"""
        usage = LLMUsage()

        # Valid score
        resp1 = LLMResponse(
            provider="test", model="test", score=50,
            reasoning="test", raw_response="test", usage=usage, cost=0.0, duration_ms=0
        )
        assert resp1.score == 50

        # Edge cases
        resp2 = LLMResponse(
            provider="test", model="test", score=0,
            reasoning="test", raw_response="test", usage=usage, cost=0.0, duration_ms=0
        )
        assert resp2.score == 0


class TestAnthropicProvider:
    """Test Anthropic provider (mocked)"""

    @patch('app.services.llm.providers.anthropic.AsyncAnthropic')
    def test_anthropic_init_success(self, mock_client):
        """Test Anthropic initialization"""
        with patch('app.services.llm.providers.anthropic.settings') as mock_settings:
            mock_settings.ANTHROPIC_API_KEY = "test-key"
            mock_settings.LLM_TIMEOUT = 30
            mock_settings.LLM_MAX_RETRIES = 3

            from app.services.llm.providers.anthropic import AnthropicProvider
            provider = AnthropicProvider()

            assert provider.default_model == "claude-3-5-sonnet-20240620"
            assert provider.cost_tracker is not None

    def test_anthropic_parse_json_response(self):
        """Test Anthropic JSON response parsing"""
        from app.services.llm.providers.anthropic import AnthropicProvider

        provider = AnthropicProvider.__new__(AnthropicProvider)
        response_text = '{"score": 92, "reasoning": "Excellent logical structure"}'

        parsed = provider._parse_response(response_text)
        assert parsed.score == 92
        assert parsed.reasoning == "Excellent logical structure"

    def test_anthropic_parse_fallback_response(self):
        """Test Anthropic fallback response parsing"""
        from app.services.llm.providers.anthropic import AnthropicProvider

        provider = AnthropicProvider.__new__(AnthropicProvider)
        response_text = "The proof score: 78. This is a good proof structure."

        parsed = provider._parse_response(response_text)
        assert parsed.score == 78
        assert len(parsed.reasoning) > 0

    def test_anthropic_invalid_score_fallback(self):
        """Test Anthropic invalid score handling"""
        from app.services.llm.providers.anthropic import AnthropicProvider

        provider = AnthropicProvider.__new__(AnthropicProvider)
        response_text = '{"score": "not-a-number", "reasoning": "bad format"}'

        parsed = provider._parse_response(response_text)
        assert parsed.score == 50  # Default fallback


class TestOpenAIProvider:
    """Test OpenAI provider (mocked)"""

    @patch('app.services.llm.providers.openai.AsyncOpenAI')
    def test_openai_init_success(self, mock_client):
        """Test OpenAI initialization"""
        with patch('app.services.llm.providers.openai.settings') as mock_settings:
            mock_settings.OPENAI_API_KEY = "test-key"
            mock_settings.LLM_TIMEOUT = 30
            mock_settings.LLM_MAX_RETRIES = 3

            from app.services.llm.providers.openai import OpenAIProvider
            provider = OpenAIProvider()

            assert provider.default_model == "gpt-4o-2024-05-13"
            assert provider.cost_tracker is not None

    def test_openai_parse_json_response(self):
        """Test OpenAI JSON response parsing"""
        from app.services.llm.providers.openai import OpenAIProvider

        provider = OpenAIProvider.__new__(OpenAIProvider)
        response_text = '{"score": 88, "reasoning": "Valid mathematical proof"}'

        parsed = provider._parse_response(response_text)
        assert parsed.score == 88
        assert parsed.reasoning == "Valid mathematical proof"

    def test_openai_json_mode_config(self):
        """Test OpenAI JSON mode configuration"""
        opts = EvaluationOptions(json_mode=True)
        assert opts.json_mode is True

        opts2 = EvaluationOptions(json_mode=False)
        assert opts2.json_mode is False


class TestGoogleProvider:
    """Test Google provider (mocked)"""

    @patch('app.services.llm.providers.google.genai')
    def test_google_init_success(self, mock_genai):
        """Test Google initialization"""
        with patch('app.services.llm.providers.google.settings') as mock_settings:
            mock_settings.GOOGLE_API_KEY = "test-key"

            from app.services.llm.providers.google import GoogleAIProvider
            provider = GoogleAIProvider()

            assert provider.default_model == "gemini-1.5-pro"
            assert provider.cost_tracker is not None

    def test_google_parse_json_response(self):
        """Test Google JSON response parsing"""
        from app.services.llm.providers.google import GoogleAIProvider

        provider = GoogleAIProvider.__new__(GoogleAIProvider)
        response_text = '{"score": 95, "reasoning": "Excellent proof validation"}'

        parsed = provider._parse_response(response_text)
        assert parsed.score == 95
        assert parsed.reasoning == "Excellent proof validation"

    def test_google_usage_metadata_handling(self):
        """Test Google usage metadata handling"""
        usage = LLMUsage(
            prompt_tokens=1500,
            completion_tokens=800,
            total_tokens=2300
        )
        assert usage.total_tokens == 2300


class TestExceptionHandling:
    """Test exception handling in providers"""

    def test_cost_tracker_reset(self):
        """Test cost tracker reset"""
        tracker = CostTracker(provider="anthropic")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)

        tracker.calculate("claude-3-5-sonnet-20240620", usage)
        assert tracker.call_count == 1
        assert tracker.total_cost > 0

        tracker.reset()
        assert tracker.call_count == 0
        assert tracker.total_cost == 0.0

    def test_unknown_provider_pricing(self):
        """Test unknown provider pricing"""
        tracker = CostTracker(provider="unknown")
        usage = LLMUsage(prompt_tokens=1000, completion_tokens=500, total_tokens=1500)
        cost = tracker.calculate("unknown-model", usage)

        assert cost == 0.0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
