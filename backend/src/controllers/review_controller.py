from src.crud.books import get_book_by_id
from src.crud.user import search_by_id
from src.crud.reviews import add_review_to_db
from src.models.review_model import Review
from fastapi import HTTPException

class ReviewController:
    def add_review_command(self, review: Review):
        # Valid stars
        if(review.stars > 5 or review.stars < 0):
            raise HTTPException(status_code=422,detail="Invalid stars")

        # Validate that the user exists
        user = search_by_id(review.user_id)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")

        # Validate that the book exists
        book = get_book_by_id(review.book_id)
        if book == -1:
            raise HTTPException(status_code=404, detail="Book not found")
        # Add the review to the database
        return add_review_to_db(review)
