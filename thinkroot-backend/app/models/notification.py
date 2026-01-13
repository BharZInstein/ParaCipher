from pydantic import BaseModel
from typing import Optional


class Notification(BaseModel):
    id: str
    userId: str
    title: str
    message: str
    type: str  # info, success, warning, error
    read: bool
    createdAt: str

    class Config:
        from_attributes = True


class NotificationResponse(Notification):
    pass
