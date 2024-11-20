from fastapi import APIRouter, HTTPException
from typing import List
from src.models.review_model import Review
from src.controllers.review_controller import ReviewController

reviewController = ReviewController()
router = APIRouter()

# Endpoint to create a review
@router.post("/make_review", response_model=Review)
async def make_review(review: Review):
    try:
        result = reviewController.add_review_command(review)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating review")

# Endpoint to get all reviews for a given book
@router.get("/reviews/book/{book_id}")
async def get_book_reviews(book_id: str):
    try:
        reviews = reviewController.get_book_reviews(book_id)
        return reviews
    except HTTPException as e:
        raise e
    
# Endpoint to delete a review
@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str):
    try:
        success = reviewController.delete_review(review_id)
        if success:
            return {"message": f"Review with id {review_id} has been deleted"}
        else:
            raise HTTPException(status_code=500, detail=f"Error deleting review")
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting review: {e}")
#Endpoint to get the reviews made by a given user
@router.get("/reviews/user/{user_id}")
async def get_user_reviews(user_id: str):
    try:
        result = reviewController.get_user_reviews(user_id)
        return result
    except HTTPException as e:
        raise e