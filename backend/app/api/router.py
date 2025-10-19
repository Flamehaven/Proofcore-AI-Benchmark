# [=] ProofCore Backend - API Router
# Aggregates all API endpoints

from fastapi import APIRouter
from app.api.endpoints import proofs, config

api_router = APIRouter()

# Include configuration endpoints with /config prefix
# CRITICAL: This is the SINGLE SOURCE OF TRUTH for frontend configuration
api_router.include_router(
    config.router,
    prefix="/config",
    tags=["configuration"]
)

# Include proof endpoints with /proofs prefix
api_router.include_router(
    proofs.router,
    prefix="/proofs",
    tags=["proofs"]
)

# [T] Future endpoint groups for v3.8.0+
# from app.api.endpoints import users, analytics, admin
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
# api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
