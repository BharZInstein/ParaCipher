from fastapi import APIRouter
from app.core.mock_store import mock_store
from app.models.common import HomeResponse

router = APIRouter()


@router.get("/home")
def get_home():
    """
    Get home screen overview.
    
    Returns shift status, balance, active policy, and alerts.
    """
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    active_policy = mock_store.get_active_policy("user_001")
    shift_status = "active" if active_policy else "inactive"
    
    # Simulate alerts (would come from oracle data in real system)
    alerts = []
    if user["balance"] < 100:
        alerts.append({
            "type": "warning",
            "message": "Low balance. Fund your wallet to purchase coverage."
        })
    
    return HomeResponse(
        shiftStatus=shift_status,
        balance=user["balance"],
        activePolicy=dict(active_policy) if active_policy else None,
        alerts=alerts
    )


@router.post("/settings/reset")
def reset_demo():
    """
    Reset the entire mock store to initial state.
    
    Useful for resetting the demo between presentations.
    """
    mock_store.reset()
    
    return {
        "message": "Demo state reset successfully",
        "newBalance": mock_store.get_user("user_001")["balance"]
    }


@router.get("/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ParaCipher MVP Backend",
        "version": "1.0.0"
    }
