from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.password import router as password_router
from app.api.v1.vault import router as vault_router


router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(vault_router)
router.include_router(password_router)