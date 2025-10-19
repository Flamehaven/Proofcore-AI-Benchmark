# [*] ProofCore Backend - Configuration API Endpoints
# Provides frontend with backend configuration (Single Source of Truth)

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import schemas
from app.core.config import settings
from app.db.session import get_db_session

router = APIRouter(prefix="/config", tags=["configuration"])


@router.get(
    "/verification",
    response_model=schemas.VerificationConfig,
    status_code=status.HTTP_200_OK,
    summary="Get verification configuration",
    description="Returns current verification engine configuration including weights and thresholds"
)
async def get_verification_config(
    db: AsyncSession = Depends(get_db_session)
):
    """
    Get verification engine configuration from backend.

    This is the **SINGLE SOURCE OF TRUTH** for all verification parameters.
    Frontend MUST use these values instead of hardcoding them.

    **Returns**:
    - symbolic_weight: Weight for symbolic verification (0-1)
    - semantic_weight: Weight for semantic evaluation (0-1)
    - pass_threshold: Minimum score to pass verification (0-100)

    **Why This Matters**:
    - Prevents configuration drift between frontend and backend
    - Allows admins to change weights without redeploying frontend
    - Ensures consistent verification across all clients

    **Usage in Frontend**:
    ```typescript
    const config = await fetch('/api/v1/config/verification').then(r => r.json());
    const { symbolic_weight, semantic_weight } = config;

    // Use these values instead of hardcoding!
    const combined = symbolic_weight * symbolicScore + semantic_weight * semanticScore;
    ```
    """
    return schemas.VerificationConfig(
        symbolic_weight=settings.SYMBOLIC_WEIGHT,
        semantic_weight=settings.SEMANTIC_WEIGHT,
        pass_threshold=settings.PASS_THRESHOLD,
    )


@router.get(
    "/application",
    response_model=schemas.ApplicationConfig,
    status_code=status.HTTP_200_OK,
    summary="Get application configuration",
    description="Returns general application configuration"
)
async def get_application_config(
    db: AsyncSession = Depends(get_db_session)
):
    """
    Get general application configuration.

    **Returns**:
    - app_name: Application name
    - app_version: Application version
    - api_version: API version

    **Note**:
    - This endpoint is public (no authentication required for read-only info)
    - Useful for frontend to display version information
    """
    return schemas.ApplicationConfig(
        app_name=settings.APP_NAME,
        app_version=settings.APP_VERSION,
        api_version="v1",
    )


# [T] Future configuration endpoints

# @router.get("/features")
# async def get_feature_flags(...):
#     """Get feature flags for frontend UI"""
#     pass
#
# @router.get("/limits")
# async def get_service_limits(...):
#     """Get service limits (max proofs per user, etc)"""
#     pass
