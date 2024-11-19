from src.crud.books import get_book_by_id, update_book_attributes
from src.crud.user import search_by_id
from src.crud.reviews import add_review_to_db, delete_review_by_id, get_book_reviews, get_book_with_review, get_review_by_id, get_user_reviews
from src.models.review_model import Review
from fastapi import HTTPException
import uuid


class ReviewController:
    def add_review_command(self, review: Review):
        # Valid stars
        if review.stars > 5 or review.stars < 1:
            raise HTTPException(status_code=422, detail="Invalid stars")

        # Validate that the user exists
        user = search_by_id(review.user_id)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")

        # Validate that the book exists
        book = get_book_by_id(review.book_id)
        if book == -1:
            raise HTTPException(status_code=404, detail="Book not found")

        # Add the review to the database
        new_review = add_review_to_db(review)

        # Calculate new avgstars and numreviews
        try:
            new_numreviews = book.numreviews + 1
            new_avgstars = (book.avgstars * (book.numreviews / new_numreviews)) + (review.stars / new_numreviews)

            # Update the book attributes in the database
            update_book_attributes(book.id, {"numreviews": new_numreviews, "avgstars": new_avgstars})
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating book statistics: {str(e)}")

        return new_review
    
    def delete_review(self, review_id: str):
        # Check if the given uuid is valid
        if not self.is_valid_uuid(review_id):
            raise HTTPException(status_code=400, detail="Invalid review ID format")
        
        # Check if the review exists
        review = get_review_by_id(review_id)
        if review == -1:
            raise HTTPException(status_code=404, detail="Review not found")
        
        # Check if the book with this review exists
        book_id = get_book_with_review(review_id)
        book = get_book_by_id(book_id)
        if book == -1:
            raise HTTPException(status_code=404, detail="No book found with this review")
        
        # Compute the new values for numreviews and avgstars and update them
        new_numreviews = book.numreviews -1
        if(new_numreviews != 0):
            new_avgstars = (book.avgstars*(book.numreviews / new_numreviews)) - review.stars/new_numreviews
        else:
            new_avgstars = 0
        new_attributes = {"numreviews": new_numreviews, "avgstars": new_avgstars}
        try:
            update_book_attributes(book_id, new_attributes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error updating book attributes: {str(e)}")
        
        # Delete review
        try:
            success = delete_review_by_id(review_id)
            return success         
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to delete review")

    def get_book_reviews(self, book_id: str):
        # Check if book exists in the database
        book = get_book_by_id(book_id)
        if book == -1:
            raise HTTPException(status_code=404, detail="No book found with this id")
        result = get_book_reviews(book_id)
        return result

    def is_valid_uuid(self, value: str):
        try:
            uuid.UUID(value)
            return True
        except ValueError:
            return False


 
      
    def get_user_reviews(self, user_id: str):
        user = search_by_id(user_id)

        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        
        reviews = get_user_reviews(user_id)
        return reviews
