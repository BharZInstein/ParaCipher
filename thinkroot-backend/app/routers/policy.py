from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.mock_store import mock_store
from app.models.policy import PolicyResponse

router = APIRouter()


class PurchaseCoverageRequest(BaseModel):
    durationHours: int


@router.post("/purchase")
def purchase_coverage(request: PurchaseCoverageRequest):
    """
    Purchase instant coverage for a shift.
    
    - Calculates premium (₹25/hour base)
    - Applies SBT discount (20% for score >= 50)
    - Creates active policy
    - Deducts balance
    """
    user = mock_store.get_user("user_001")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Premium calculation: ₹25/hour base
    base_premium = 25 * request.durationHours
    
    # SBT discount: 20% if score >= 50
    discount_rate = 0.20 if user["sbtScore"] >= 50 else 0
    premium_paid = int(base_premium * (1 - discount_rate))
    
    # Check balance
    if user["balance"] < premium_paid:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Create policy
    policy = mock_store.create_policy("user_001", request.durationHours, premium_paid)
    
    # Deduct balance
    mock_store.update_balance("user_001", -premium_paid)
    
    # Create transaction record
    mock_store.create_transaction(
        "user_001",
        "premium",
        premium_paid,
        reference_id=policy["id"]
    )
    
    # Create notification
    mock_store.create_notification(
        "user_001",
        "Coverage purchased!",
        f"You're covered for {request.durationHours}h. Policy ID: {policy['id']}",
        "success"
    )
    
    return {
        "policy": PolicyResponse(**policy),
        "premiumBreakdown": {
            "basePremium": base_premium,
            "discountRate": discount_rate * 100,
            "discountAmount": base_premium - premium_paid,
            "premiumPaid": premium_paid
        },
        "newBalance": user["balance"] - premium_paid
    }


@router.get("/{policy_id}")
def get_policy(policy_id: str):
    """Get details of a specific policy."""
    policy = mock_store.get_policy(policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    return PolicyResponse(**policy)


@router.get("")
def get_user_policies():
    """Get all policies for the current user."""
    policies = mock_store.get_user_policies("user_001")
    return {
        "policies": [PolicyResponse(**p) for p in policies],
        "count": len(policies)
    }


@router.get("/active/current")
def get_active_policy():
    """Get the currently active policy for the user."""
    policy = mock_store.get_active_policy("user_001")
    
    if not policy:
        return {
            "policy": None,
            "shiftStatus": "inactive"
        }
    
    return {
        "policy": PolicyResponse(**policy),
        "shiftStatus": "active"
    }
