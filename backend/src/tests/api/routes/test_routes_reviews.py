import pytest
from fastapi.testclient import TestClient
from src.main import app  # Assuming your FastAPI app instance is defined here
from src.models.review_model import Review
from src.models.user_model import User
from src.controllers.user_controller import UserController
from src.controllers.review_controller import ReviewController
from src.controllers.book_controller import BooksController
import uuid

client = TestClient(app)
user_controller = UserController()
review_controller = ReviewController()
book_controller = BooksController()
"""
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

"""
def test_delete_review():
    # Create a review for a given book
    book_id = "f57cfc4b-5736-4351-a73b-a1f3032eaabb"
    payload = {
        "comment": "Review to delete",
        "stars": 2,
        "user_id": "6c679679-6a17-44fc-9a4b-99046444d5e1",
        "book_id": book_id
    }
    response = client.post("/make_review", json=payload)
    review_id = response.json()['id']
    prev_book = book_controller.get_book_by_id_query(book_id)
    result = client.delete(f"/reviews/{review_id}")
    new_book = book_controller.get_book_by_id_query(book_id)

    # Check if response is correct
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert result.json() == {"message": f"Review with id {review_id} has been deleted"}
    assert new_book.numreviews == prev_book.numreviews - 1
    if (prev_book.numreviews - 1) != 0:
        assert new_book.avgstars == ((prev_book.avgstars*prev_book.numreviews) - 2)/(prev_book.numreviews -1)
    else:
        assert new_book.avgstars == 0

def test_delete_review_incorrect_id():
    review_id = str(uuid.uuid4())
    result = client.delete(f"/reviews/{review_id}")
    assert result.status_code == 404, f"Expected 404, got {result.status_code}. Details: {result.json()}"

def test_get_book_reviews_correct_id():
    # Create some users
    userData = [{
        "email": "review1@gmail.com",
        "username": "reviewerTest",
        "password": "passwordReview"
    },
    {
        "email": "review2@gmail.com",
        "username": "reviewerTest2",
        "password": "passwordReview2"
    }    
    ]
    users = []
    for user in userData:
        users.append(user_controller.create_user_command(User(**user)))
    
    # Create some reviews for a predetermined book
    book_id = "bfe050b4-c596-4f8f-99c3-99084600adfc"
    reviewData = [{
        "comment": "Test Review",
        "stars": 2,
        "user_id": users[0].id,
        "book_id": book_id
    },
    {
        "comment": "Test Review",
        "stars": 3,
        "user_id": users[0].id,
        "book_id": book_id
    },
    {
        "comment": "Test Review",
        "stars": 1,
        "user_id": users[1].id,
        "book_id": book_id
    }]
    reviews = []
    for review in reviewData:
        reviews.append(review_controller.add_review_command(Review(**review)))
    
    # Call the get endpoint
    result = client.get(f"/reviews/book/{book_id}")
    r = result.json()
    
    # Sort the lists in order to check if the contents are the same
    r.sort(key=lambda x: x['id'])
    reviews.sort(key=lambda x: x.id)
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert len(reviews) == len(r)
    
    # Check if all information is returned correctly
    for i in range(0,len(reviews)):
        assert reviews[i].id == r[i]['id']
        assert reviews[i].user_id == r[i]['user_id']
        assert reviews[i].book_id == r[i]['book_id']
        assert reviews[i].stars == r[i]['stars']
        assert reviews[i].comment == r[i]['comment']
        assert str(reviews[i].date) == r[i]['date']
        assert str(reviews[i].time)[:14] == r[i]['time'][:14]
        review_controller.delete_review(reviews[i].id)
    
    # Delete created users from the database
    for user in users:
        user_controller.delete_user_command(user.id)

def test_get_book_reviews_non_existent_id():
    # Create a random uuid
    book_id = str(uuid.uuid4())
    result = client.get(f"/reviews/book/{book_id}")

    assert result.status_code == 404, f"Expected 404, got {result.status_code}. Details: {result.json()}"

def test_get_book_reviews_without_reviews():
    book_id = "0a16b779-b4bf-44bb-ac1f-c59c4d3f0d95"
    result = client.get(f"/reviews/book/{book_id}")

    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert result.json() == []