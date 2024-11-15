import uuid
from pydantic import BaseModel, Field
from datetime import date, time

class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    _comment: str
    _rating: int
    _date: date
    _time: time
    _book_id: str
    _user_id: str

    def __repr__(self):
        return f"Review(id='{self.id}, comment='{self._comment}, date='{self._date}, time='{self._time},book_id='{self._book_id}, user_id='{self._user_id}')"
    
    class Config:
        from_attributes = True
    
    # Getters

    @property
    def comment(self)-> str:
        return self._comment
    
    @property
    def date(self)-> str:
        return self._date
    
    @property
    def time(self)-> str:
        return self._time
    
    @property
    def book_id(self)-> str:
        return self._book_id
    
    @property
    def user_id(self)-> str:
        return self._user_id
    
    @property
    def rating(self) -> int:
        return self._rating
    
    # None of these field should be modified so no setter is implemented