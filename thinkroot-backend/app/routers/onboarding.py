from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.mock_store import mock_store
from app.models.user import UserResponse

router = APIRouter()


class OnboardingCompleteRequest(BaseModel):
    kycStatus: str = "verified"


@router.post("/complete")
def complete_onboarding(request: OnboardingCompleteRequest):
    """
    Complete onboarding for a user.
    
    Returns updated user profile with initial balance.
    """
    user = mock_store.get_user("user_001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update KYC status
    updated_user = mock_store.update_user("user_001", {
        "kycStatus": request.kycStatus
    })
    
    # Create welcome notification
    mock_store.create_notification(
        "user_001",
        "Welcome to ParaCipher!",
        "You're all set. Now purchase coverage for your next shift.",
        "success"
    )
    
    return {
        "user": UserResponse(**updated_user)
    }


@router.get("/status")
def get_onboarding_status():
    """Get onboarding status for current user."""
    user = mock_store.get_user("user_001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "userId": user["id"],
        "walletAddress": user["walletAddress"],
        "kycStatus": user["kycStatus"],
        "isComplete": user["kycStatus"] == "verified"
    }
