from fastapi import APIRouter, HTTPException
from typing import List, Optional
from src.models.book_model import Book
from src.controllers.book_controller import BooksController

booksController = BooksController()
router = APIRouter()

# Endpoint to get all books
@router.get("/books", response_model=List[Book])
async def get_all_books():
    try:
        books = booksController.get_all_books_query()
        return books
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching books")

# Endpoint to add a new book
@router.post("/books", response_model=Book)
async def add_new_book(book: Book):
    try:
        result = booksController.add_book_command(book)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error adding book")
    
# REGION 5.4 search books by title
# Endpoint to search books by partial title
@router.get("/books/search/{partial_title}", response_model=List[Book])
async def get_book_matches_by_title(partial_title: str, max_num: Optional[int] = None):
    try:
        books = booksController.get_book_matches_by_title_query(partial_title, max_num)
        if not books:  # This will check if the list is empty
            return []
        return books
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching books by partial title")

# Endpoint to get all book titles
@router.get("/titles", response_model=List[str])
async def get_all_titles():
    try:
        titles = booksController.get_all_titles_query()
        return titles
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching book titles")
# ENDREGION

# # REGION 6.1 search by id
# # Endpoint to get a book by ID
# @router.get("/books/{book_id}", response_model=Book)
# async def get_book_by_id(book_id: str):
#     try:
#         book = booksController.get_book_by_id_query(book_id)
#         if book == -1:
#             raise HTTPException(status_code=404, detail="Book not found")
#         return book
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error fetching book by ID")

# # Endpoint to get a book by title
# @router.get("/books/title/{title}", response_model=Book)
# async def get_book_by_title(title: str):
#     try:
#         book = booksController.get_book_by_title_query(title)
#         if book == -1:
#             raise HTTPException(status_code=404, detail="Book not found")
#         return book
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error fetching book by title")

# # Endpoint to get books by author
# @router.get("/books/author/{author}", response_model=List[Book])
# async def get_books_by_author(author: str):
#     try:
#         books = booksController.get_books_by_author_query(author)
#         if books == -1:
#             raise HTTPException(status_code=404, detail="No books found for this author")
#         return books
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error fetching books by author")
# # ENDREGION