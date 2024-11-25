from src.main import app
from src import crud
from src.models.user_model import User
import uuid
import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

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
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"
    assert response.json() == created_user.username, f"Expected {created_user.username}, got {response.json()}"

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
