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
