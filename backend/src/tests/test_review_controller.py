import pytest
from fastapi import HTTPException
from src.models.review_model import Review
from src.controllers.review_controller import ReviewController
from unittest.mock import patch
from datetime import date, time

reviewController = ReviewController()

# Test adding a valid review
def test_add_valid_review():
    review = Review(
        user_id= "6c679679-6a17-44fc-9a4b-99046444d5e1",
        book_id= "55b4e870-fd29-4419-b871-ec9dd7205e1b",
        stars= 4,
        comment = "Great book")
    response = reviewController.add_review_command(review)
    assert response is not None,"Failed to add valid review"

# Test adding a review with invalid stars
def test_add_review_invalid_stars():
    review = Review(
        comment="Terrible book.",
        stars=6,  # Invalid
        book_id="55b4e870-fd29-4419-b871-ec9dd7205e1b",
        user_id="6c679679-6a17-44fc-9a4b-99046444d5e1",
    )
    with pytest.raises(HTTPException) as excinfo:
        reviewController.add_review_command(review)
    assert excinfo.value.status_code == 422
    assert excinfo.value.detail == "Invalid stars"

# Test adding a review with a non-existent user
def test_add_review_user_not_found():
    review = Review(
        comment="Interesting book.",
        stars=4,
        book_id="55b4e870-fd29-4419-b871-ec9dd7205e1b",
        user_id="non_existent_user",
    )
    with pytest.raises(HTTPException) as excinfo:
        reviewController.add_review_command(review)
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "User not found"

# Test adding a review with a non-existent book
def test_add_review_book_not_found():
    review = Review(
        comment="Average book.",
        stars=3,
        book_id="non_existent_book",
        user_id="6c679679-6a17-44fc-9a4b-99046444d5e1",
    )
    with pytest.raises(HTTPException) as excinfo:
        reviewController.add_review_command(review)
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Book not found"
