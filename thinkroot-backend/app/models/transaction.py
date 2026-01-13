from pydantic import BaseModel
from typing import Optional


class Transaction(BaseModel):
    id: str
    userId: str
    type: str
    amount: int
    status: str
    timestamp: str
    referenceHash: Optional[str] = None
    referenceId: str = ""

    class Config:
        from_attributes = True


class TransactionResponse(Transaction):
    pass
