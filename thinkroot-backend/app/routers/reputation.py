from fastapi import APIRouter
from app.core.mock_store import mock_store

router = APIRouter()


@router.get("")
def get_reputation():
    """
    Get Safety Passport (SBT) reputation data.
    
    Returns SBT score, tier discount, and safety metrics.
    """
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    # Calculate metrics from policies/claims
    policies = mock_store.get_user_policies("user_001")
    claims = []
    for policy in policies:
        claims.extend(mock_store.get_policy_claims(policy["id"]))
    
    speed_events = sum(1 for p in policies if "speed" in p.get("nftId", "").lower())
    harsh_braking = sum(1 for p in policies if "brake" in p.get("nftId", "").lower())
    
    return {
        "sbtScore": user["sbtScore"],
        "tierDiscount": 20 if user["sbtScore"] >= 50 else 0,
        "metrics": {
            "speedEvents": speed_events,
            "harshBraking": harsh_braking,
            "nightShifts": len([p for p in policies if "night" in p.get("nftId", "").lower()]),
            "successfulClaims": sum(1 for c in claims if c["status"] == "paid"),
            "totalPolicies": len(policies)
        },
        "badges": _get_badges(user["sbtScore"])
    }


def _get_badges(sbt_score: int) -> list:
    """Determine badges based on SBT score."""
    badges = []
    
    if sbt_score >= 80:
        badges.append({"name": "Platinum", "icon": "⭐⭐⭐"})
    elif sbt_score >= 60:
        badges.append({"name": "Gold", "icon": "⭐⭐"})
    elif sbt_score >= 40:
        badges.append({"name": "Silver", "icon": "⭐"})
    else:
        badges.append({"name": "Bronze", "icon": "🛡️"})
    
    return badges


@router.post("/update")
def update_reputation_metrics():
    """
    Update SBT score based on recent activity.
    
    In a real system, this would be triggered by oracle data.
    For mock, we just recalculate.
    """
    user = mock_store.get_user("user_001")
    if not user:
        return {"error": "User not found"}
    
    # Increment score by 5 points (demo)
    new_score = min(user["sbtScore"] + 5, 100)
    mock_store.update_user("user_001", {"sbtScore": new_score})
    
    return {
        "message": "Reputation updated",
        "sbtScore": new_score,
        "change": new_score - user["sbtScore"]
    }
