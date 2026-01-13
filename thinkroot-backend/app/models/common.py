from pydantic import BaseModel


class LoginRequest(BaseModel):
    walletAddress: str


class AuthResponse(BaseModel):
    token: str
    userId: str


class WalletResponse(BaseModel):
    walletAddress: str
    gasless: bool
    activePolicies: list


class HomeResponse(BaseModel):
    shiftStatus: str
    balance: int
    activePolicy: dict = None
    alerts: list
