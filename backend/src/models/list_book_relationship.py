import uuid
from pydantic import BaseModel, Field

class ListBookRelationship(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Generate UUID as a string by default
    list_id: str
    book_id: str


    def __repr__(self):
        return f"ListBookRelationship(id='{self.id}', list_id='{self.list_id}', book_id='{self.book_id}')"

    class Config:
        from_attributes = True