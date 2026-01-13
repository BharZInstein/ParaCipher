from fastapi import APIRouter
from app.models.common import WalletResponse
from app.core.mock_store import mock_store

router = APIRouter()


@router.get("", response_model=WalletResponse)
def get_wallet():
    """
    Get wallet information.
    
    Returns wallet address, gasless status, and active policies.
    """
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    policies = mock_store.get_user_policies("user_001")
    active_policies = [p["id"] for p in policies if p["status"] == "active"]
    
    return WalletResponse(
        walletAddress=user["walletAddress"],
        gasless=True,
        activePolicies=active_policies
    )


@router.get("/balance")
def get_balance():
    """Get current wallet balance."""
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    return {
        "balance": user["balance"],
        "currency": "INR"
    }


@router.post("/fund")
def fund_wallet(amount: int):
    """
    Mock fund wallet endpoint (for demo purposes).
    
    Adds credits to the wallet.
    """
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    new_balance = mock_store.update_balance("user_001", amount)
    
    # Record transaction
    mock_store.create_transaction(
        "user_001",
        "topup",
        amount
    )
    
    # Notification
    mock_store.create_notification(
        "user_001",
        "Wallet funded!",
        f"₹{amount} added to your wallet.",
        "success"
    )
    
    return {
        "previousBalance": user["balance"],
        "fundedAmount": amount,
        "newBalance": new_balance
    }
