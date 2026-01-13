from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.routers import (
    auth,
    onboarding,
    policy,
    claims,
    history,
    reputation,
    wallet,
    settings as settings_router,
)

# Create FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    description=settings.API_DESCRIPTION,
    version=settings.API_VERSION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/onboarding", tags=["Onboarding"])
app.include_router(policy.router, prefix="/policy", tags=["Policies"])
app.include_router(claims.router, prefix="/claims", tags=["Claims"])
app.include_router(history.router, prefix="/history", tags=["Transaction History"])
app.include_router(reputation.router, prefix="/reputation", tags=["Safety Passport"])
app.include_router(wallet.router, prefix="/wallet", tags=["Wallet"])
app.include_router(settings_router.router, prefix="/api", tags=["Settings & Health"])


@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint - API info."""
    return {
        "message": "Welcome to ParaCipher MVP Backend",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "openapi": "/openapi.json"
    }


@app.get("/openapi", tags=["Root"])
def get_openapi():
    """Get OpenAPI schema."""
    return app.openapi()


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Global exception handler."""
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
