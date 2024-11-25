import pytest
from fastapi import HTTPException
from src.crud.books import get_book_by_id
from src.models.review_model import Review
from src.controllers.review_controller import ReviewController
from unittest.mock import patch
from datetime import date, time

reviewController = ReviewController()

# Test adding a valid review
def test_add_valid_review():
    review = Review(
        user_id= "db079be4-b49e-423e-bb96-ba26897d700a",
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
        user_id="db079be4-b49e-423e-bb96-ba26897d700a",
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
        user_id="db079be4-b49e-423e-bb96-ba26897d700a",
    )
    with pytest.raises(HTTPException) as excinfo:
        reviewController.add_review_command(review)
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Book not found"

def test_update_book_stats():
    book_id = "55b4e870-fd29-4419-b871-ec9dd7205e1b"
    book_before = get_book_by_id(book_id)
    initial_numreviews = book_before.numreviews
    initial_avgstars = book_before.avgstars
    review = Review(
        user_id="db079be4-b49e-423e-bb96-ba26897d700a",
        book_id=book_id,
        stars=4,
        comment="Great book!"
    )
    reviewController.add_review_command(review)
    book_after = get_book_by_id(book_id)
    updated_numreviews = book_after.numreviews
    updated_avgstars = book_after.avgstars
    
    assert updated_numreviews == initial_numreviews + 1, (
        f"numreviews should increase by 1. Before: {initial_numreviews}, After: {updated_numreviews}"
    )
    expected_avgstars = round(((initial_avgstars * initial_numreviews) + 4) / (initial_numreviews + 1), 2)
    updated_avgstars_rounded = round(updated_avgstars, 2)
    
    assert updated_avgstars_rounded == expected_avgstars, (
        f"avgstars should be recalculated correctly. Expected: {expected_avgstars}, Actual: {updated_avgstars_rounded}"
    )
