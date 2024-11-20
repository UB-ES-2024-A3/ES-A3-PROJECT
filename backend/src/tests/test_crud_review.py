from unittest.mock import MagicMock, patch
from src.crud.books import *
from src.crud.reviews import * 
from src.models.review_model import Review
from src.models.book_model import Book
import random
import pytest

# Test to add a review to the database
def test_add_review_to_db():
    review = Review(
        user_id= "6c679679-6a17-44fc-9a4b-99046444d5e1",
        book_id= "55b4e870-fd29-4419-b871-ec9dd7205e1b",
        stars= 4,
        comment= "Liked the book")

    created_review = add_review_to_db(review)
    assert created_review.user_id == "6c679679-6a17-44fc-9a4b-99046444d5e1"
    assert created_review.book_id == "55b4e870-fd29-4419-b871-ec9dd7205e1b"
    assert created_review.stars == 4
    assert created_review.comment == "Liked the book"
