from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PolicyBase(BaseModel):
    durationHours: int


class PolicyCreate(PolicyBase):
    pass


class Policy(PolicyBase):
    id: str
    userId: str
    premiumPaid: int
    status: str
    nftId: str
    coverageStart: str
    coverageEnd: str
    createdAt: str

    class Config:
        from_attributes = True


class PolicyResponse(Policy):
    pass
