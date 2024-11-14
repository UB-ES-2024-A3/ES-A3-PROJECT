from src.main import app
from src import crud

import pytest
from fastapi.testclient import TestClient
from src.models.book_model import Book

# Fixture for TestClient
@pytest.fixture
def client():
    return TestClient(app)

# Mock data for tests
mock_book = Book(id="1", title="Test Book", author="Test Author", genre="Fiction", published_year=2021)

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


# REGION 6.1 search by id

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

# Test for getting a book by valid title OPTIONAL
def test_get_book_by_title(client: TestClient):
    title = "North Carolina Ghosts and Legends"  # Use a title that exists in your test database or mock
    response = client.get(f"/books/title/{title}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert response.json()["title"] == title, "Book title should match requested title"

# Test for getting a book by invalid title OPTIONAL
def test_get_book_by_invalid_title(client: TestClient):
    invalid_title = "Nonexistent Book"
    response = client.get(f"/books/title/{invalid_title}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.text}"
    assert response.json()["detail"] == "Book not found", "Error message should be 'Book not found'"

# Test for getting books by author OPTIONAL
def test_get_books_by_author(client: TestClient):
    author = "Roberts, Nancy"  # Use an author that exists in your test database or mock
    response = client.get(f"/books/author/{author}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert isinstance(response.json(), list), "Response should be a list of books"

# Test for getting books by invalid author OPTIONAL
def test_get_books_by_invalid_author(client: TestClient):
    invalid_author = "Unknown Author"
    response = client.get(f"/books/author/{invalid_author}")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.text}"
    assert response.json() == [], "Expected an empty list when no books are found for this author"
# ENDREGION