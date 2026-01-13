from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from app.utils.ids import (
    generate_user_id,
    generate_policy_id,
    generate_claim_id,
    generate_transaction_id,
    generate_nft_id,
    generate_wallet_address,
    generate_tx_hash,
)


class MockStore:
    """In-memory mock database for ParaCipher MVP."""
    
    def __init__(self):
        self.reset()
    
    def reset(self):
        """Reset all mock data to initial state."""
        wallet_address = generate_wallet_address()
        
        self.users: Dict[str, Any] = {
            "user_001": {
                "id": "user_001",
                "walletAddress": wallet_address,
                "kycStatus": "verified",
                "sbtScore": 50,
                "balance": 1000,
                "createdAt": (datetime.now() - timedelta(days=7)).isoformat(),
            }
        }
        
        self.policies: Dict[str, Any] = {}
        self.claims: Dict[str, Any] = {}
        self.transactions: List[Dict[str, Any]] = []
        self.notifications: List[Dict[str, Any]] = []
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
    
    # ===== USER OPERATIONS =====
    def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        return self.users.get(user_id)
    
    def update_user(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if user_id not in self.users:
            raise ValueError(f"User {user_id} not found")
        self.users[user_id].update(data)
        return self.users[user_id]
    
    def update_balance(self, user_id: str, amount: int) -> int:
        user = self.get_user(user_id)
        if not user:
            raise ValueError(f"User {user_id} not found")
        user["balance"] += amount
        return user["balance"]
    
    # ===== POLICY OPERATIONS =====
    def create_policy(self, user_id: str, duration_hours: int, premium_paid: int) -> Dict[str, Any]:
        policy_id = generate_policy_id()
        now = datetime.now()
        coverage_end = now + timedelta(hours=duration_hours)
        
        policy = {
            "id": policy_id,
            "userId": user_id,
            "durationHours": duration_hours,
            "premiumPaid": premium_paid,
            "status": "active",
            "nftId": generate_nft_id(),
            "coverageStart": now.isoformat(),
            "coverageEnd": coverage_end.isoformat(),
            "createdAt": now.isoformat(),
        }
        
        self.policies[policy_id] = policy
        return policy
    
    def get_policy(self, policy_id: str) -> Optional[Dict[str, Any]]:
        return self.policies.get(policy_id)
    
    def get_user_policies(self, user_id: str) -> List[Dict[str, Any]]:
        return [p for p in self.policies.values() if p["userId"] == user_id]
    
    def get_active_policy(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get the active policy for a user (if any)."""
        policies = self.get_user_policies(user_id)
        for policy in policies:
            if policy["status"] == "active":
                coverage_end = datetime.fromisoformat(policy["coverageEnd"])
                if coverage_end > datetime.now():
                    return policy
            # Auto-expire if coverage period ended
            if policy["status"] == "active":
                coverage_end = datetime.fromisoformat(policy["coverageEnd"])
                if coverage_end <= datetime.now():
                    policy["status"] = "expired"
        return None
    
    def update_policy(self, policy_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if policy_id not in self.policies:
            raise ValueError(f"Policy {policy_id} not found")
        self.policies[policy_id].update(data)
        return self.policies[policy_id]
    
    # ===== CLAIM OPERATIONS =====
    def create_claim(self, policy_id: str, description: str = "") -> Dict[str, Any]:
        claim_id = generate_claim_id()
        now = datetime.now()
        
        claim = {
            "id": claim_id,
            "policyId": policy_id,
            "status": "pending",
            "description": description,
            "createdAt": now.isoformat(),
            "payoutAmount": None,
            "payoutTxHash": None,
            "payoutDate": None,
        }
        
        self.claims[claim_id] = claim
        return claim
    
    def get_claim(self, claim_id: str) -> Optional[Dict[str, Any]]:
        return self.claims.get(claim_id)
    
    def get_policy_claims(self, policy_id: str) -> List[Dict[str, Any]]:
        return [c for c in self.claims.values() if c["policyId"] == policy_id]
    
    def approve_claim(self, claim_id: str, payout_amount: int) -> Dict[str, Any]:
        claim = self.get_claim(claim_id)
        if not claim:
            raise ValueError(f"Claim {claim_id} not found")
        
        claim.update({
            "status": "paid",
            "payoutAmount": payout_amount,
            "payoutTxHash": generate_tx_hash(),
            "payoutDate": datetime.now().isoformat(),
        })
        return claim
    
    # ===== TRANSACTION OPERATIONS =====
    def create_transaction(
        self,
        user_id: str,
        tx_type: str,
        amount: int,
        status: str = "success",
        reference_id: str = "",
    ) -> Dict[str, Any]:
        now = datetime.now()
        tx = {
            "id": generate_transaction_id(),
            "userId": user_id,
            "type": tx_type,  # "premium", "claim", "refund"
            "amount": amount,
            "status": status,
            "timestamp": now.isoformat(),
            "referenceHash": generate_tx_hash() if status == "success" else None,
            "referenceId": reference_id,
        }
        
        self.transactions.append(tx)
        return tx
    
    def get_user_transactions(self, user_id: str, tx_filter: str = "") -> List[Dict[str, Any]]:
        txs = [t for t in self.transactions if t["userId"] == user_id]
        if tx_filter:
            txs = [t for t in txs if t["type"] == tx_filter]
        return sorted(txs, key=lambda x: x["timestamp"], reverse=True)
    
    # ===== NOTIFICATION OPERATIONS =====
    def create_notification(
        self,
        user_id: str,
        title: str,
        message: str,
        notification_type: str = "info",
    ) -> Dict[str, Any]:
        notification = {
            "id": generate_transaction_id(),
            "userId": user_id,
            "title": title,
            "message": message,
            "type": notification_type,  # "info", "success", "warning", "error"
            "read": False,
            "createdAt": datetime.now().isoformat(),
        }
        
        self.notifications.append(notification)
        return notification
    
    def get_user_notifications(self, user_id: str) -> List[Dict[str, Any]]:
        return sorted(
            [n for n in self.notifications if n["userId"] == user_id],
            key=lambda x: x["createdAt"],
            reverse=True,
        )
    
    # ===== SESSION OPERATIONS =====
    def create_session(self, user_id: str, token: str) -> Dict[str, Any]:
        self.active_sessions[token] = {
            "userId": user_id,
            "createdAt": datetime.now().isoformat(),
        }
        return self.active_sessions[token]
    
    def get_session(self, token: str) -> Optional[Dict[str, Any]]:
        return self.active_sessions.get(token)
    
    def invalidate_session(self, token: str) -> bool:
        if token in self.active_sessions:
            del self.active_sessions[token]
            return True
        return False


# Global mock store instance
mock_store = MockStore()
