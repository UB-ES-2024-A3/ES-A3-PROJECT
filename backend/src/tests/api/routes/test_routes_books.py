from src.main import app
from src import crud

import pytest
from fastapi.testclient import TestClient
from src.models.book_model import Book

# Fixture for TestClient
@pytest.fixture
def client():
    return TestClient(app)

# Test for getting all books
def test_get_all_books(client: TestClient):
    response = client.get("/books")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert isinstance(response.json(), list), "Response should be a list of books"

# Test for retrieving all book titles
def test_get_all_titles(client: TestClient):
    response = client.get("/titles")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert isinstance(response.json(), list), "Response should be a list of titles"
    assert all(isinstance(title, str) for title in response.json()), "All items in the list should be strings"

# Test for retrieving books by partial titles
def test_retrieving_books_by_partial_titles(client: TestClient):
    response = client.get("/books/search/north")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert isinstance(response.json(), list), "Response should be a list of titles"

# Test for getting a book by valid ID
def test_get_book_by_id(client: TestClient):
    book_id = "9f3e79b5-221a-4931-952a-4b3952ba7c5c" 
    response = client.get(f"/books/{book_id}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert response.json()["id"] == book_id, "Book ID should match requested ID"

# Test for getting a book by invalid ID
def test_get_book_by_invalid_id(client: TestClient):
    invalid_book_id = "9999"
    response = client.get(f"/books/{invalid_book_id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.text}"
    assert response.json()["detail"] == "Book not found", "Error message should be 'Book not found'"
