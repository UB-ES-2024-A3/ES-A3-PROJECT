import pytest
from src.controllers.book_controller import BooksController
from src.models.book_model import Book
from fastapi import HTTPException

booksController = BooksController()

# Test get_all_books_query
def test_get_all_books_query():
    books = booksController.get_all_books_query()
    assert len(books) > 0, "No books found"


# Test add_book_command with valid book
def test_add_book_command_valid():
    book = Book(
        title="Test Book Title",
        author="Test Author",
        genres=["Fiction"],
        description="A test description for the book."
    )
    created_book = booksController.add_book_command(book)
    assert created_book is not None, "Failed to add valid book"

# Test add_book_command with missing required fields
def test_add_book_command_missing_fields():
    book = Book(
        title="",
        author="",
        genres=[],
        description="Missing required fields"
    )
    with pytest.raises(HTTPException) as excinfo:
        booksController.add_book_command(book)
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "Title, Author, and Genre are required"

# Test get_all_titles_query
def test_retrieving_books_by_partial_titles():
    titles = booksController.get_book_matches_by_title_query("north")
    assert len(titles) > 1, "No titles found"

# Test get_all_titles_query
def test_retrieving_books_by_partial_titles():
    titles = booksController.get_book_matches_by_title_query("north", 1)
    assert len(titles) == 1, "No titles found"

# Test get_all_titles_query
def test_get_all_titles_query():
    titles = booksController.get_all_titles_query()
    assert len(titles) > 0, "No titles found"


# REGION 6.1 search by id

# Test get_book_by_id_query with valid ID
def test_get_book_by_id_query_valid():
    book_id = "9f3e79b5-221a-4931-952a-4b3952ba7c5c"  
    book = booksController.get_book_by_id_query(book_id)
    assert book is not None, "Failed to retrieve book by valid ID"

# Test get_book_by_id_query with invalid ID
def test_get_book_by_id_query_invalid():
    with pytest.raises(HTTPException) as excinfo:
        booksController.get_book_by_id_query("123e4567-221a-4931-952a-4b3952ba7c5c")
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Book not found"

# Test get_book_by_id_query with empty ID
def test_get_book_by_id_query_empty():
    with pytest.raises(HTTPException) as excinfo:
        booksController.get_book_by_id_query("")
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "Book ID is required"

# Test get_book_by_title_query with valid title OPTIONAL
def test_get_book_by_title_query_valid():
    title = "North Carolina Ghosts and Legends"  
    book = booksController.get_book_by_title_query(title)
    assert book is not None, "Failed to retrieve book by valid title"

# Test get_book_by_title_query with non-existing title OPTIONAL
def test_get_book_by_title_query_non_existing():
    with pytest.raises(HTTPException) as excinfo:
        booksController.get_book_by_title_query("Non-Existing Title")
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Book not found"

# Test get_book_by_title_query with empty title OPTIONAL
def test_get_book_by_title_query_empty():
    with pytest.raises(HTTPException) as excinfo:
        booksController.get_book_by_title_query("")
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "Title is required"

# Test get_books_by_author_query with valid author OPTIONAL
def test_get_books_by_author_query_valid():
    author = "Roberts, Nancy"
    books = booksController.get_books_by_author_query(author)
    assert len(books) > 0, "Failed to retrieve books by valid author"

# Test get_books_by_author_query with non-existing author OPTIONAL
def test_get_books_by_author_query_non_existing():
    author = "Amncy"
    books = booksController.get_books_by_author_query(author)
    assert len(books) == 0, "Failed to retrieve books by valid author"

# Test get_books_by_author_query with empty author name OPTIONAL
def test_get_books_by_author_query_empty():
    with pytest.raises(HTTPException) as excinfo:
        booksController.get_books_by_author_query("")
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "Author name is required"

# ENDREGION