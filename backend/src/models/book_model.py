from typing import List
import uuid
from pydantic import BaseModel, Field

class Book(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))  # Generate UUID as a string by default
    author: str
    title: str
    genres: List[str]
    description : str

    def __repr__(self):
        return (f"ID: {self.id}\nTítulo: {self.title}\nAuthor: {self.author}\n" f"Descripción: {self.description}\nGéneros: {', '.join(self.genres)}")

    class Config:
        from_attributes = True

    # Getters
    
    @property
    def author(self) -> str:
        return self.author

    @property
    def title(self) -> str:
        return self.title
    
    @property
    def genres(self) -> List[str]:
        return self.genres
    
    @property
    def description(self) -> str:
        return self.description