from src.crud.books import *
from src.models.book_model import Book
import random
import pytest

##############################################################################
# TO RUN THESE TESTS RUN FROM SOURCE python -m backend.test.apitests
##############################################################################

# Test to retrieve all books from the database
def test_get_all_books():
    print("\n\n-----------------------------GET ALL BOOKS TEST-----------------------------")
    books = get_all_books()
    print(f"{len(books)} books found.")
    print("First book example:")
    print(books[0] if books else "No books found.")
    assert len(books) > 0, "Test failed: No books found"
    print("Test passed successfully")

# Test to add a new book to the database
def test_add_book():
    print("\n\n------------------------------ADD NEW BOOK-------------------------------")
    randomint = random.randint(1, 1000)
    book = Book(
        title=f"Test Book {randomint}",
        author="Test Author",
        genres=["Fiction", "Adventure"],
        description="A test book for unit testing.",
    )
    created_book = add_book(book)
    print("Created book:", created_book)
    assert created_book, "Test failed: Book not created"
    print("Test passed successfully")
    assert created_book.id

# Test to retrieve all books by incomplete title
def test_get_all_titles():
    print("\n\n--------------------GET ALL BOOKS BY INCOMPLETE TITLES---------------------")
    books = get_book_matches_by_title("north")
    assert len(books) > 0, "Test failed: No titles found"
    print("Test passed successfully")

# Test to retrieve all book titles
def test_get_all_titles():
    print("\n\n-----------------------------GET ALL BOOK TITLES-----------------------------")
    titles = get_all_titles()
    print(f"{len(titles)} titles found.")
    print("Example title:", titles[0] if titles else "No titles found.")
    assert len(titles) > 0, "Test failed: No titles found"
    print("Test passed successfully")

# REGION 6.1 search by id

# Test to retrieve a book by its ID
def test_get_book_by_id():
    print("\n\n-----------------------------GET BOOK BY ID-----------------------------")
    book = get_book_by_id("9f3e79b5-221a-4931-952a-4b3952ba7c5c")
    print("Retrieved book:", book)
    assert book != -1, "Test failed: Book not found"
    print("Test passed successfully")
# ENREGION
