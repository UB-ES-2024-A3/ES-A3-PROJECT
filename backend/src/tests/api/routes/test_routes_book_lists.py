import pytest
from fastapi.testclient import TestClient
from src.crud import book_lists
from src.main import app
from src.models.user_model import User
from src.controllers.user_controller import UserController

client = TestClient(app)
user_controller = UserController()

def test_create_valid_list():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Test List", "user_id": user.id}
    result = client.post(f"/bookList", json = list_data)
    data = result.json()
    book_lists.delete_list(data["id"])
    user_controller.delete_user_command(user.id)
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert data["name"] == "Test List"
    assert data["user_id"] == user.id

def test_create_list_invalid_name():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Very long name over 50 characters long and more characters", "user_id": user.id}
    result = client.post(f"/bookList", json = list_data)
    data = result.json()
    user_controller.delete_user_command(user.id)
    assert result.status_code == 404, f"Expected 404, got {result.status_code}. Details: {result.json()}"

def test_create_list_repeated_name():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Test List", "user_id": user.id}
    result = client.post(f"/bookList", json = list_data)
    data = result.json()
    result1 = client.post(f"/bookList", json = list_data)
    book_lists.delete_list(data["id"])
    user_controller.delete_user_command(user.id)
    assert result1.status_code == 500, f"Expected 500, got {result1.status_code}. Details: {result1.json()}"