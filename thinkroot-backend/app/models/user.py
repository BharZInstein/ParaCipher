from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    walletAddress: str
    kycStatus: str


class UserCreate(UserBase):
    pass


class User(UserBase):
    id: str
    sbtScore: int
    balance: int
    createdAt: str

    class Config:
        from_attributes = True


class UserResponse(User):
    pass
