import uuid
from pydantic import BaseModel, Field

class Follower(BaseModel):
    follower_id: str
    followed_id: str


    def __repr__(self):
        return f"Follower(follower='{self.follower_id}', followed='{self.followed_id}')"

    class Config:
        from_attributes = True
