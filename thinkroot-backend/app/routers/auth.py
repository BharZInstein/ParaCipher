from fastapi import APIRouter, HTTPException
from app.models.common import LoginRequest, AuthResponse
from app.core.mock_store import mock_store
from app.utils.ids import generate_id

router = APIRouter()


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    """
    Mock authentication endpoint.
    
    Returns a mock JWT token and user ID.
    For demo purposes, any wallet address is accepted.
    """
    # In a real system, verify wallet signature here
    user = mock_store.get_user("user_001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate mock token
    token = f"mock-jwt-{generate_id()}"
    mock_store.create_session(user["id"], token)
    
    return AuthResponse(
        token=token,
        userId=user["id"]
    )


@router.post("/logout")
def logout(token: str):
    """Logout and invalidate session."""
    if mock_store.invalidate_session(token):
        return {"message": "Logout successful"}
    raise HTTPException(status_code=401, detail="Invalid token")
