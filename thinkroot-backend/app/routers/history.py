from fastapi import APIRouter
from app.core.mock_store import mock_store
from app.models.transaction import TransactionResponse

router = APIRouter()


@router.get("")
def get_transaction_history(filter: str = ""):
    """
    Get transaction history for the current user.
    
    Query Parameters:
    - filter: "premium", "claim", or "" (all)
    """
    transactions = mock_store.get_user_transactions("user_001", filter)
    
    return {
        "transactions": [TransactionResponse(**t) for t in transactions],
        "count": len(transactions),
        "filter": filter or "all"
    }


@router.get("/type/{tx_type}")
def get_transactions_by_type(tx_type: str):
    """Get transactions filtered by type (premium, claim, refund)."""
    transactions = mock_store.get_user_transactions("user_001", tx_type)
    
    return {
        "transactions": [TransactionResponse(**t) for t in transactions],
        "type": tx_type,
        "count": len(transactions)
    }
