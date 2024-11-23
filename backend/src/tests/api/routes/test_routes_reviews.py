import pytest
from fastapi.testclient import TestClient
from src import crud
from src.main import app
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

def test_make_review_success():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    payload = {
        "user_id": created_user.id,
        "book_id": "9531ebe1-6385-44f4-8827-8fd517b4adf8",
        "stars": 4,
        "comment": "Liked the book"
    }
    response = client.post("/make_review", json=payload)
    data = response.json()
    review_controller.delete_review(data["id"])
    user_controller.delete_user_command(user.id)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert data["comment"] == "Liked the book"
    assert data["stars"] == 4
    assert data["book_id"] == payload["book_id"]
    assert data["user_id"] == payload["user_id"]

def test_make_review_invalid_stars():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    payload = {
        "user_id": created_user.id,
        "comment": "Bad review",
        "stars": 10,
        "book_id": "9531ebe1-6385-44f4-8827-8fd517b4adf8"
    }
    response = client.post("/make_review", json=payload)
    user_controller.delete_user_command(user.id)
    assert response.status_code == 422

def test_make_review_no_comment():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    payload = {
        "user_id": created_user.id,
        "book_id": "9531ebe1-6385-44f4-8827-8fd517b4adf8",
        "stars": 4
    }
    response = client.post("/make_review", json=payload)
    data = response.json()
    review_controller.delete_review(data["id"])
    user_controller.delete_user_command(user.id)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert data["comment"] == ""
    assert data["stars"] == 4


def test_delete_review():
    book_id = "d59fbe4e-ac9c-49f0-8edd-22667bb75270"
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    payload = {
        "user_id": created_user.id,
        "comment": "Review to delete",
        "stars": 2,
        "book_id": book_id
    }
    response = client.post("/make_review", json=payload)
    review_id = response.json()["id"]
    prev_book = book_controller.get_book_by_id_query(book_id)
    result = client.delete(f"/reviews/{review_id}")
    new_book = book_controller.get_book_by_id_query(book_id)
    user_controller.delete_user_command(user.id)
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert result.json() == {"message": f"Review with id {review_id} has been deleted"}
    assert new_book.numreviews == prev_book.numreviews - 1
    if new_book.numreviews > 0:
        assert round(new_book.avgstars, 1) == round(((prev_book.avgstars * prev_book.numreviews) - 2) / new_book.numreviews, 1)
    else:
        assert new_book.avgstars == 0

def test_delete_review_incorrect_id():
    review_id = str(uuid.uuid4())
    result = client.delete(f"/reviews/{review_id}")
    assert result.status_code == 404

def test_get_book_reviews_correct_id():
    userData = [
        {"email": "user2026@hotmail.com", "username": "user2026", "password": "passwordReview"},
        {"email": "user2025@hotmail.com", "username": "user2025", "password": "passwordReview2"}
    ]
    users = [user_controller.create_user_command(User(**data)) for data in userData]
    book_id = "afedad77-d554-438d-9cf6-19a0fc9c6335"
    reviewData = [
        {"comment": "Test Review 1", "stars": 2, "user_id": users[0].id, "book_id": book_id},
        {"comment": "Test Review 2", "stars": 3, "user_id": users[0].id, "book_id": book_id},
        {"comment": "Test Review 3", "stars": 1, "user_id": users[1].id, "book_id": book_id}
    ]
    reviews = [review_controller.add_review_command(Review(**data)) for data in reviewData]
    result = client.get(f"/reviews/book/{book_id}")
    response_data = result.json()
    reviews_sorted = sorted(reviews, key=lambda review: review.time, reverse=True)

    for review in reviews:
        review_controller.delete_review(review.id)
    for user in users:
        user_controller.delete_user_command(user.id)
        
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert len(reviews) == len(response_data), f"Expected {len(reviews)} reviews, but got {len(response_data)}."
    for expected, actual in zip(reviews_sorted, response_data):
        assert expected.id == actual["id"], f"Expected ID {expected.id}, got {actual['id']}."
        assert expected.comment == actual["comment"], f"Expected comment '{expected.comment}', got '{actual['comment']}'."
        assert expected.stars == actual["stars"], f"Expected stars {expected.stars}, got {actual['stars']}."
        assert expected.user_id == actual["user_id"], f"Expected user_id {expected.user_id}, got {actual['user_id']}."
        assert expected.book_id == actual["book_id"], f"Expected book_id {expected.book_id}, got {actual['book_id']}."
        assert expected.time.isoformat() == actual["time"], f"Expected time {expected.time}, got {actual['time']}."

def test_get_book_reviews_non_existent_id():
    book_id = str(uuid.uuid4())
    result = client.get(f"/reviews/book/{book_id}")
    assert result.status_code == 404

def test_get_book_reviews_without_reviews():
    book_id = "0a16b779-b4bf-44bb-ac1f-c59c4d3f0d95"
    result = client.get(f"/reviews/book/{book_id}")
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert result.json() == []

def test_get_user_reviews_correct_id():
    userData = {"email": "user2026@hotmail.com", "username": "user2026", "password": "passwordReview"}
    user = user_controller.create_user_command(User(**userData))
    book_ids = [
        "9531ebe1-6385-44f4-8827-8fd517b4adf8",
        "061415e7-c278-4f40-9425-61abb0f5c02d",
        "8b322f2f-f7c4-48f6-bbbf-4c26d5756286"
    ]
    reviewData = [
        {"comment": "Test Review 1", "stars": 2, "user_id": user.id, "book_id": book_ids[0]},
        {"comment": "Test Review 2", "stars": 3, "user_id": user.id, "book_id": book_ids[1]},
        {"comment": "Test Review 3", "stars": 1, "user_id": user.id, "book_id": book_ids[2]}
    ]
    reviews = [review_controller.add_review_command(Review(**data)) for data in reviewData]

    result = client.get(f"/reviews/user/{user.id}")
    response_data = result.json()
    reviews_sorted = sorted(reviews, key=lambda review: review.time, reverse=True)
    for review in reviews:
        review_controller.delete_review(review.id)
    user_controller.delete_user_command(user.id)

    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert len(reviews) == len(response_data), f"Expected {len(reviews)} reviews, but got {len(response_data)}."
    for expected, actual in zip(reviews_sorted, response_data):
        assert expected.id == actual["id"], f"Expected ID {expected.id}, got {actual['id']}."
        assert expected.comment == actual["comment"], f"Expected comment '{expected.comment}', got '{actual['comment']}'."
        assert expected.stars == actual["stars"], f"Expected stars {expected.stars}, got {actual['stars']}."
        assert expected.user_id == actual["user_id"], f"Expected user_id {expected.user_id}, got {actual['user_id']}."
        assert expected.book_id == actual["book_id"], f"Expected book_id {expected.book_id}, got {actual['book_id']}."
        # Compare time strings up to the first 13 characters because expected time format is (YYYY-MM-DDTHH:MM:SS.mmmmm) and actual is (YYYY-MM-DDTHH:MM:SS.mmmmmm) (1 more)
        assert str(expected.time)[:13] == str(actual["time"])[:13], f"Expected time {expected.time}, got {actual['time']}."

def test_get_user_reviews_non_existent_id():
    user_id = str(uuid.uuid4())
    result = client.get(f"/reviews/user/{user_id}")
    assert result.status_code == 404

def test_get_user_reviews_without_reviews():
    userData = {"email": "user2026@hotmail.com", "username": "user2026", "password": "passwordReview"}
    user = user_controller.create_user_command(User(**userData))
    result = client.get(f"/reviews/user/{user.id}")
    user_controller.delete_user_command(user.id)
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert result.json() == []