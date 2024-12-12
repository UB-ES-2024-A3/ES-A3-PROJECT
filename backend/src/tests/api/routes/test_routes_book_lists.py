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

def test_get_book_list_with_relationship():
    user_data = {
        "email": "user2024@hotmail.com",
        "username": "user2024",
        "password": "securePassword123",
    }
    user = User(**user_data)
    user_controller.create_user_command(user)

    list_data = {"name": "Test Relationship List", "user_id": user.id}
    list_result = client.post("/bookList", json=list_data)
    book_list = list_result.json()
    assert list_result.status_code == 200, f"Expected 200, got {list_result.status_code}. Details: {list_result.json()}"
    book_id = "6c6c742a-f645-46b8-994e-3b71aae01372"  # Example book ID
    relationship_data = {
        "user_id": user.id,
        "book_id": book_id,
        "book_list": {book_list["id"]: True},
    }
    relationship_result = client.post("/booklist/update", json=relationship_data)
    assert relationship_result.status_code == 200, f"Expected 200, got {relationship_result.status_code}. Details: {relationship_result.json()}"

    # Step 4: Fetch Lists and Verify Relationship
    get_result = client.get(
        f"/user/booklists?user_id={user.id}&book_id={book_id}"
    )
    fetched_lists = get_result.json()
    assert get_result.status_code == 200, f"Expected 200, got {get_result.status_code}. Details: {get_result.json()}"
    assert any(
        item["list_id"] == book_list["id"] and item["checked"] is True
        for item in fetched_lists
    ), "The book-list relationship was not fetched correctly."

    # Step 5: Delete the Relationship
    cleanup_data = {
        "user_id": user.id,
        "book_id": book_id,
        "book_list": {book_list["id"]: False},
    }
    cleanup_result = client.post("/booklist/update", json=cleanup_data)
    assert cleanup_result.status_code == 200, f"Expected 200, got {cleanup_result.status_code}. Details: {cleanup_result.json()}"

    # Step 6: Delete the List
    book_lists.delete_list(book_list["id"])

    # Step 7: Delete the User
    user_controller.delete_user_command(user.id)

    # Step 8: Assertions
    # Verify that the list no longer exists in the database
    deleted_list = client.get(f"/user/booklists?user_id={user.id}&book_id={book_id}")
    assert len(deleted_list.json()) == 0, "List was not properly deleted."

def test_add_relationship_invalid_list_id():
    user_data = {
        "email": "user@hotmail.com",
        "username": "user2024",
        "password": "securePassword123",
    }
    user = User(**user_data)
    user_controller.create_user_command(user)

    # Use a nonexistent list ID
    book_id = str(uuid.uuid4())
    relationship_data = {
        "user_id": user.id,
        "book_id": book_id,
        "book_list": {str(uuid.uuid4()): True},
    }
    result = client.post("/booklist/update", json=relationship_data)
    user_controller.delete_user_command(user.id)

    assert result.status_code == 500, f"Expected 500, got {result.status_code}. Details: {result.json()}"

def test_create_list_missing_user_id():
    list_data = {"name": "Missing User List"}
    result = client.post("/bookList", json=list_data)
    assert result.status_code == 422, f"Expected 422, got {result.status_code}. Details: {result.json()}"