import uuid
from pydantic import BaseModel, Field
from datetime import date, time

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    comment: str
    stars: int
    date: date
    time: time
    book_id: str
    user_id: str

    def __repr__(self):
        return f"Review(id='{self.id}, comment='{self.comment}, stars='{self.stars}, date='{self.date}, time='{self.time},book_id='{self.book_id}, user_id='{self.user_id}')"
    
    class Config:
        from_attributes = True
    
    # Getters

    @property
    def comment(self)-> str:
        return self.comment
    
    @property
    def date(self)-> str:
        return self.date
    
    @property
    def time(self)-> str:
        return self.time
    
    @property
    def book_id(self)-> str:
        return self.book_id
    
    @property
    def user_id(self)-> str:
        return self.user_id
    
    @property
    def stars(self) -> int:
        return self.stars
    
    # None of these field should be modified so no setter is implemented