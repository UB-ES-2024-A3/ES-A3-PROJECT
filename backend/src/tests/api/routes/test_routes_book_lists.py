import pytest
import uuid
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


def test_update_book_list_success():
    user_data = {
        "email": "user2024@hotmail.com",
        "username": "user2024",
        "password": "dumbPassword",
    }
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Test List", "user_id": user.id}
    list_result = client.post(f"/bookList", json=list_data)
    book_list = list_result.json()
    book_id = "6c6c742a-f645-46b8-994e-3b71aae01372"

    update_data = {
        "user_id": user.id,
        "book_id": book_id,
        "book_list": {book_list["id"]: True},
    }
    result = client.post("/booklist/update", json=update_data)
    data = result.json()

    cleanup_data = {
        "user_id": user.id,
        "book_id": book_id,
        "book_list": {book_list["id"]: False},
    }
    cleanup_result = client.post("/booklist/update", json=cleanup_data)
    cleanup_response = cleanup_result.json()
    book_lists.delete_list(book_list["id"])
    user_controller.delete_user_command(user.id)
    assert (
        result.status_code == 200
    ), f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert data == True
    assert (
        cleanup_result.status_code == 200
    ), f"Expected 200, got {cleanup_result.status_code}. Details: {cleanup_result.json()}"
    assert cleanup_response == True

def test_update_book_list_missing_fields():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)
    list_data = {"name": "Test List", "user_id": user.id}
    list_result = client.post(f"/bookList", json=list_data)
    book_list = list_result.json()
    update_data = {
        "book_id": "6c6c742a-f645-46b8-994e-3b71aae01372",
        "book_list": {book_list["id"]: True}
    }
    result = client.post("/booklist/update", json=update_data)
    book_lists.delete_list(book_list["id"])
    user_controller.delete_user_command(user.id)
    assert result.status_code == 500, f"Expected 500, got {result.status_code}. Details: {result.json()}"


def test_update_book_list_invalid_user():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Test List", "user_id": user.id}
    list_result = client.post(f"/bookList", json=list_data)
    book_list = list_result.json()

    update_data = {
        "user_id": "invalid_user_id",
        "book_id": "6c6c742a-f645-46b8-994e-3b71aae01372",
        "book_list": {book_list["name"]: True}
    }
    result = client.post("/booklist/update", json=update_data)
    book_lists.delete_list(book_list["id"])
    user_controller.delete_user_command(user.id)

    assert result.status_code == 500, f"Expected 500, got {result.status_code}. Details: {result.json()}"


def test_update_book_list_duplicate_relationship():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)
    list_data = {"name": "Test List", "user_id": user.id}
    list_result = client.post(f"/bookList", json=list_data)
    book_list = list_result.json()

    update_data = {
        "user_id": user.id,
        "book_id": "6c6c742a-f645-46b8-994e-3b71aae01372",
        "book_list": {book_list["name"]: True}
    }
    client.post("/booklist/update", json=update_data)

    result = client.post("/booklist/update", json=update_data)

    book_lists.delete_list(book_list["id"])
    user_controller.delete_user_command(user.id)
    assert result.status_code == 500, f"Expected 500, got {result.status_code}. Details: {result.json()}"


def test_get_user_lists():
    user_data = {"email": "user2024@hotmail.com", "username": "user2024", "password": "dumbPassword"}
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = [{"name": "Second List", "user_id": user.id}, {"name": "First List", "user_id": user.id}]
    added_lists = []
    for l in list_data:
        added_lists.append(client.post(f"/bookList", json = l).json())
    
    result = client.get(f"/bookList/{user.id}")
    result_data = result.json()

    for l in added_lists:
        book_lists.delete_list(l["id"])
    user_controller.delete_user_command(user.id)    
    assert result.status_code == 200, f"Expected 200, got {result.status_code}. Details: {result.json()}"
    assert len(added_lists) == len(result.json())
    for expected, real in zip(added_lists, result_data):
        assert expected["id"] == real["id"]
        assert expected["name"] == real["name"]
    
def test_get_user_lists_invalid_user():
    invalid_id = str(uuid.uuid4())
    result = client.get(f"/bookList/{invalid_id}")

    assert result.status_code == 404, f"Expected 404, got {result.status_code}. Details: {result.json()}"         