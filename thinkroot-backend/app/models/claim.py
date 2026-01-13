from pydantic import BaseModel
from typing import Optional


class ClaimBase(BaseModel):
    description: str = ""


class ClaimCreate(ClaimBase):
    pass


class Claim(ClaimBase):
    id: str
    policyId: str
    status: str
    createdAt: str
    payoutAmount: Optional[int] = None
    payoutTxHash: Optional[str] = None
    payoutDate: Optional[str] = None

    class Config:
        from_attributes = True


class ClaimResponse(Claim):
    pass
