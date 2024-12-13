from src.controllers.user_controller import UserController 
from src.controllers.review_controller import ReviewController
from src.controllers.book_controller import BooksController
from src.main import app
from src import crud
from src.models.user_model import User
from src.models.review_model import Review
import uuid
import pytest
from fastapi.testclient import TestClient
import time
import logging

logger = logging.getLogger(__name__)

@pytest.fixture
def client():
    return TestClient(app)

user_controller = UserController()
review_controller = ReviewController()
book_controller = BooksController()

def test_get_all_users(client: TestClient):
    response = client.get("/users")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"

def test_create_user(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    response = client.post("/users", json=user_data)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    created_user = response.json()
    crud.user.delete_user(created_user["id"])
    assert created_user["email"] == user_data["email"], f"Expected {user_data['email']}, got {created_user['email']}"
    assert created_user["username"] == user_data["username"], f"Expected {user_data['username']}, got {created_user['username']}"

def test_delete_user(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.delete(f"/users/{created_user.id}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert f"User with id {created_user.id} has been deleted" in response.json().get("message")
    response = client.get(f"/users/id/{created_user.id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"

def test_get_user_by_username(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.get(f"/users/username/{created_user.username}")
    crud.user.delete_user(created_user.id)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json()["username"] == created_user.username, f"Expected {created_user.username}, got {response.json()['username']}"


def test_get_user_by_email(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.get(f"/users/email/{created_user.email}")
    crud.user.delete_user(created_user.id)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json()["email"] == created_user.email, f"Expected {created_user.email}, got {response.json()['email']}"

def test_get_user_by_id(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.get(f"/users/id/{created_user.id}")
    crud.user.delete_user(created_user.id)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json()["id"] == created_user.id, f"Expected {created_user.id}, got {response.json()['id']}"

def test_get_username_by_id(client: TestClient):
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.get(f"/users/username/id/{created_user.id}")
    crud.user.delete_user(created_user.id)
    response_data = response.json()
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response_data["username"] == created_user.username, f"Expected {created_user.username}, got {response_data()['username']}"
    assert response_data["followers"] == created_user.followers, f"Expected {created_user.followers}, got {response_data()['followers']}"
    assert response_data["following"] == created_user.following, f"Expected {created_user.following}, got {response_data()['following']}"


def test_get_username_with_invalid_id(client: TestClient):
    invalid_id = str(uuid.uuid4())
    response = client.get(f"/users/username/id/{invalid_id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_get_user_by_nonexistent_email(client: TestClient):
    invalid_email = "nonexistent@hotmail.com"
    response = client.get(f"/users/email/{invalid_email}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_get_user_by_nonexistent_id(client: TestClient):
    invalid_id = str(uuid.uuid4())
    response = client.get(f"/users/id/{invalid_id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_follow_user_valid_id(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    response = client.get(f"/users/follow/{created_user_1.id}/{created_user_2.id}")
    response_data = response.json()

    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    assert response_data["follower_id"] == created_user_1.id
    assert response_data["followed_id"] == created_user_2.id
    assert updated_user_1.following == (created_user_1.following + 1)
    assert updated_user_1.followers == created_user_1.followers
    assert updated_user_2.following == created_user_2.following
    assert updated_user_2.followers == (created_user_2.followers +1)

def test_unfollow_user(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    follower = crud.followers.create_follower(created_user_1.id, created_user_2.id)

    response = client.delete(f"/users/unfollow/{created_user_1.id}/{created_user_2.id}")
    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert updated_user_1.following == (created_user_1.following - 1)
    assert updated_user_1.followers == created_user_1.followers
    assert updated_user_2.following == created_user_2.following
    assert updated_user_2.followers == (created_user_2.followers - 1)


    user = crud.followers.get_follower(user1.id, user2.id)
    assert user == False

    # Try to delete unfollower with invalid ID
    response = client.delete(f"/users/unfollow/{created_user_1.id}/{created_user_2.id}")

    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"

def test_get_username_with_invalid_id(client: TestClient):
    invalid_id = str(uuid.uuid4())
    response = client.get(f"/users/username/id/{invalid_id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_get_user_by_nonexistent_email(client: TestClient):
    invalid_email = "nonexistent@hotmail.com"
    response = client.get(f"/users/email/{invalid_email}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_get_user_by_nonexistent_id(client: TestClient):
    invalid_id = str(uuid.uuid4())
    response = client.get(f"/users/id/{invalid_id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert "User not found" in response.json().get("detail"), f"Expected error message 'User not found', got {response.json()}"

def test_search_users(client: TestClient):
    userData = [
        {"email": "tsu@hotmail.com", "username": "tsu", "password": "test123"},
        {"email": "1tsu@hotmail.com", "username": "tsu1", "password": "test123"},
        {"email": "2tsu@hotmail.com", "username": "tsu2", "password": "test123"},
    ]

    # Create users
    users = [user_controller.create_user_command(User(**data)) for data in userData]

    search_username = "tsu"
    max_num = 3
    response = client.get(f"/users/search?username={search_username}&max_num={max_num}")
    results = response.json()

    # Delete users
    for user in users:
        user_controller.delete_user_command(user.id)

    # Assertions
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert len(results) == max_num, f"Expected {max_num} results, got {len(results)}"

    # Check the first result's username
    assert results[0]["username"] == "tsu", f"Expected first username to be 'tsu', got {results[0]['username']}"
    
    for result in results:
        assert search_username in result["username"], f"Expected '{search_username}' in username, got {result['username']}"
        assert "username" in result and "user_id" in result, f"Missing fields in result: {result}"

    # Check for nonexistent username
    response = client.get(f"/users/search?username=nonexistent&max_num=2")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json() == [], "Expected an empty list for nonexistent username"


def test_get_timeline(client: TestClient):
    userData = [
        {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"},
        {"email": "user32024@hotmail.com", "username": "user32024", "password": "dumbPassword3"}
    ]
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    
    user1 = User(**user_data_1)
    
    users = [crud.user.create_user(User(**data)) for data in userData]
    created_user_1 = crud.user.create_user(user1)

    user_controller.follow_user(created_user_1.id, users[0].id)
    user_controller.follow_user(created_user_1.id, users[1].id)

    book_id1 = "afedad77-d554-438d-9cf6-19a0fc9c6335"
    book_id2 = "5db5545e-cf02-4c37-b6fc-d415edd2eaf4"
    book_1 = book_controller.get_book_by_id_query(book_id1)
    book_2 = book_controller.get_book_by_id_query(book_id2)

    books = [book_2, book_1]
    
    reviewData = [
        {"comment": "Test Review 1", "stars": 2, "user_id": users[1].id, "book_id": book_id1},
        {"comment": "Test Review 3", "stars": 1, "user_id": users[0].id, "book_id": book_id2}
    ]

    user1_review = {"comment": "Test Review 2", "stars": 3, "user_id": user1.id, "book_id": book_id2}

    r1 =review_controller.add_review_command(Review(**reviewData[0]))
    time.sleep(60)
    r2 = review_controller.add_review_command(Review(**reviewData[1]))

    reviews = [r2, r1]
    review1 = review_controller.add_review_command(Review(**user1_review))

    response = client.get(f"users/timeline/{created_user_1.id}")
    timeline = response.json()
     
    for r in reviews:
        crud.reviews.delete_review_by_id(r.id)
    crud.reviews.delete_review_by_id(review1.id)
    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(users[0].id)
    crud.user.delete_user(users[1].id)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert len(reviews) == len(timeline), f"Expected {len(reviews)} reviews, but got {len(timeline)}."
    
    for i in range(len(reviews)):
        assert timeline[i]["user_id"] == users[i].id
        assert timeline[i]["book_id"] == books[i].id
        assert timeline[i]["username"] == users[i].username
        assert timeline[i]["title"] == books[i].title
        assert timeline[i]["author"] == books[i].author
        assert timeline[i]["rating"] == reviews[i].stars
        assert timeline[i]["description"] == reviews[i].comment
        assert str(timeline[i]["date"]) == str(reviews[i].date)
        assert str(timeline[i]["time"])[:12] == str(reviews[i].time)[:12]


def test_follow_user_valid_id(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    response = client.post(f"/users/follow/{created_user_1.id}/{created_user_2.id}")
    response_data = response.json()

    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    assert response_data["follower_id"] == created_user_1.id
    assert response_data["followed_id"] == created_user_2.id
    assert updated_user_1.following == (created_user_1.following + 1)
    assert updated_user_1.followers == created_user_1.followers
    assert updated_user_2.following == created_user_2.following
    assert updated_user_2.followers == (created_user_2.followers +1)

def test_follow_user_already_followed(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    response = client.post(f"/users/follow/{created_user_1.id}/{created_user_2.id}")
    response_data = response.json()

    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    response = client.post(f"/users/follow/{created_user_1.id}/{created_user_2.id}")

    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"

def test_get_follower(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    crud.followers.create_follower(created_user_1.id, created_user_2.id)
    response = client.get(f"/users/follow/{created_user_1.id}/{created_user_2.id}")
    response_data = response.json()

    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json() == True

def test_get_follower_not_following(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user_data_2 = {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"}
    user1 = User(**user_data_1)
    user2 = User(**user_data_2)
    created_user_1 = crud.user.create_user(user1)
    created_user_2 = crud.user.create_user(user2)

    response = client.get(f"/users/follow/{created_user_1.id}/{created_user_2.id}")
    response_data = response.json()

    updated_user_1 = crud.user.search_by_id(user1.id)
    updated_user_2 = crud.user.search_by_id(user2.id)

    crud.user.delete_user(created_user_1.id)
    crud.user.delete_user(created_user_2.id)

    assert response.status_code == 200, f"Expected 404, got {response.status_code}. Details: {response.json()}"
    assert response.json() == False
def test_get_timeline_invalid_user(client: TestClient):
    invalid_user_id = str(uuid.uuid4())
    response = client.get(f"users/timeline/{invalid_user_id}")

    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"

def test_get_timeline_no_followed(client: TestClient):
    user_data_1 = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    
    user1 = User(**user_data_1)
    
    created_user_1 = crud.user.create_user(user1)
    response = client.get(f"users/timeline/{created_user_1.id}")
    timeline = response.json()

    crud.user.delete_user(created_user_1.id)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json() == []

def test_get_timeline_no_reviews(client: TestClient):
    userData = [
        {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"},
        {"email": "user22024@hotmail.com", "username": "user22024", "password": "dumbPassword2"},
    ]
    
    users = [crud.user.create_user(User(**data)) for data in userData]

    user_controller.follow_user(users[0].id, users[1].id)

    response = client.get(f"users/timeline/{users[0].id}")
    timeline = response.json()

    for u in users:
        crud.user.delete_user(u.id)
        
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json() == []