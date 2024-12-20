import uuid
from pydantic import BaseModel, Field
from .review_model import Review
from typing import List, Optional


# Define the User class
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Generate UUID as a string by default
    email: str
    username: str
    password: str
    followers: Optional[int] = 0  # Default value
    following: Optional[int] = 0  # Default value

    def __repr__(self):
        return f"User(id='{self.id}', email='{self.email}', username='{self.username}', password='{self.password}', followers='{self.followers}', following='{self.following}')"

    class Config:
        from_attributes = True

    # Getters

    @property
    def email(self) -> str:
        return self._email

    @property
    def username(self) -> str:
        return self._username

    @property
    def password(self) -> str:
        return self._password
    