# [*] Configuration Schemas
# Data models for configuration endpoints

from pydantic import BaseModel, Field


class VerificationConfig(BaseModel):
    """
    Verification engine configuration.

    This is the SINGLE SOURCE OF TRUTH for frontend verification parameters.
    Frontend must fetch this from the /api/v1/config/verification endpoint
    and use these values instead of hardcoding them.

    This prevents configuration drift between frontend and backend.
    """

    symbolic_weight: float = Field(
        default=0.7,
        ge=0,
        le=1,
        description="Weight for symbolic verification (0-1)"
    )

    semantic_weight: float = Field(
        default=0.3,
        ge=0,
        le=1,
        description="Weight for semantic evaluation (0-1)"
    )

    pass_threshold: float = Field(
        default=70.0,
        ge=0,
        le=100,
        description="Minimum score to pass verification (0-100)"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "symbolic_weight": 0.7,
                "semantic_weight": 0.3,
                "pass_threshold": 70.0,
            }
        }


class ApplicationConfig(BaseModel):
    """Application general configuration"""

    app_name: str = Field(
        default="ProofCore API",
        description="Application name"
    )

    app_version: str = Field(
        default="1.0.0",
        description="Application version"
    )

    api_version: str = Field(
        default="v1",
        description="API version"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "app_name": "ProofCore API",
                "app_version": "1.0.0",
                "api_version": "v1",
            }
        }
