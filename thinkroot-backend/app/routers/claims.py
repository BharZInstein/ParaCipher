from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.mock_store import mock_store
from app.models.claim import ClaimResponse

router = APIRouter()


class SimulateClaimRequest(BaseModel):
    description: str = "Shift incident claim"


@router.post("/simulate")
def simulate_claim(request: SimulateClaimRequest):
    """
    Simulate a claim for testing.
    
    Creates a claim on the active policy and auto-approves it.
    """
    user = mock_store.get_user("user_001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get active policy
    policy = mock_store.get_active_policy("user_001")
    if not policy:
        raise HTTPException(status_code=400, detail="No active policy")
    
    # Create claim
    claim = mock_store.create_claim(policy["id"], request.description)
    
    # Auto-approve for demo (real system would need manual review)
    payout_amount = 5000  # Fixed payout for demo
    mock_store.approve_claim(claim["id"], payout_amount)
    
    # Update user balance
    mock_store.update_balance("user_001", payout_amount)
    
    # Create transaction record
    mock_store.create_transaction(
        "user_001",
        "claim",
        payout_amount,
        reference_id=claim["id"]
    )
    
    # Create notification
    mock_store.create_notification(
        "user_001",
        "Claim approved!",
        f"₹{payout_amount} has been paid out. Check your wallet.",
        "success"
    )
    
    return {
        "claim": ClaimResponse(**mock_store.get_claim(claim["id"])),
        "payoutAmount": payout_amount,
        "newBalance": user["balance"] + payout_amount
    }


@router.get("")
def get_user_claims():
    """Get all claims for the current user."""
    policies = mock_store.get_user_policies("user_001")
    all_claims = []
    
    for policy in policies:
        claims = mock_store.get_policy_claims(policy["id"])
        all_claims.extend(claims)
    
    return {
        "claims": [ClaimResponse(**c) for c in all_claims],
        "count": len(all_claims)
    }


@router.get("/{claim_id}")
def get_claim(claim_id: str):
    """Get details of a specific claim."""
    claim = mock_store.get_claim(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    return ClaimResponse(**claim)
