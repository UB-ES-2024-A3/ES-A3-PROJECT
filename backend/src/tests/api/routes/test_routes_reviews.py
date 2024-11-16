import pytest
from fastapi.testclient import TestClient
from src.main import app  # Assuming your FastAPI app instance is defined here
from src.models.review_model import Review

client = TestClient(app)

# Test to ensure valid review creation via the endpoint
def test_make_review_success():
    payload = {
            "user_id": "6c679679-6a17-44fc-9a4b-99046444d5e1",
            "book_id": "55b4e870-fd29-4419-b871-ec9dd7205e1b",
            "stars": 4,
            "comment": "Liked the book"
    }
    response = client.post("/make_review", json=payload)
    assert response.status_code == 200, "Review creation failed"
    data = response.json()
    assert data["comment"] == "Liked the book", "Comment does not match"
    assert data["stars"] == 4, "Stars rating is incorrect"
    assert data["book_id"] == "55b4e870-fd29-4419-b871-ec9dd7205e1b", "Book ID mismatch"
    assert data["user_id"] == "6c679679-6a17-44fc-9a4b-99046444d5e1", "User ID mismatch"

# Test to handle invalid stars value
def test_make_review_invalid_stars():
    payload = {
        "comment": "Bad review",
        "stars": 10,  # Invalid, assuming stars are 1-5
        "book_id": "6c679679-6a17-44fc-9a4b-99046444d5e1",
        "user_id": "55b4e870-fd29-4419-b871-ec9dd7205e1b"
    }
    response = client.post("/make_review", json=payload)
    assert response.status_code == 422, "Invalid stars value did not raise validation error"

# Test to ensure missing comment still creates a review
def test_make_review_no_comment():
    payload = {
            "user_id": "6c679679-6a17-44fc-9a4b-99046444d5e1",
            "book_id": "55b4e870-fd29-4419-b871-ec9dd7205e1b",
            "stars": 4,
    }
    response = client.post("/make_review", json=payload)
    assert response.status_code == 200, "Review creation failed without comment"
    data = response.json()
    assert data["comment"] == "", "Default comment is not an empty string"
    assert data["stars"] == 4, "Stars rating is incorrect"
    assert data["book_id"] == "55b4e870-fd29-4419-b871-ec9dd7205e1b", "Book ID mismatch"
    assert data["user_id"] == "6c679679-6a17-44fc-9a4b-99046444d5e1", "User ID mismatch"
