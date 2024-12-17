import uuid
from pydantic import BaseModel, Field

class BookList(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Generate UUID as a string by default
    name: str
    user_id: str


    def __repr__(self):
        return f"BookList(id='{self.id}', name='{self.name}', user_id='{self.user_id}')"

    class Config:
        from_attributes = True