import uuid
import random
import string


def generate_id(prefix: str = "") -> str:
    """Generate a unique ID with optional prefix."""
    unique = str(uuid.uuid4())[:8]
    return f"{prefix}{unique}" if prefix else unique


def generate_user_id() -> str:
    """Generate a user ID."""
    return f"user_{uuid.uuid4().hex[:8]}"


def generate_policy_id() -> str:
    """Generate a policy ID."""
    return f"policy_{uuid.uuid4().hex[:8]}"


def generate_claim_id() -> str:
    """Generate a claim ID."""
    return f"claim_{uuid.uuid4().hex[:8]}"


def generate_transaction_id() -> str:
    """Generate a transaction ID."""
    return f"tx_{uuid.uuid4().hex[:8]}"


def generate_nft_id() -> str:
    """Generate an NFT ID."""
    return f"NFT-{random.randint(100, 999)}"


def generate_wallet_address() -> str:
    """Generate a mock wallet address."""
    return "0x" + "".join(random.choices(string.hexdigits[:-6].upper(), k=40))


def generate_tx_hash() -> str:
    """Generate a mock transaction hash."""
    return "0x" + "".join(random.choices(string.hexdigits[:-6], k=64))
