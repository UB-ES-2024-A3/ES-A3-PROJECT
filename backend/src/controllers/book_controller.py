from typing import Optional
from src.crud.books import *
from fastapi import HTTPException
from src.models.book_model import Book

class BooksController:
    
    def get_all_books_query(self):
        # Retrieve all books
        return get_all_books()

    # REGION 5.4 search books by title
    def add_book_command(self, book: Book):
        if not book.title or not book.author or not book.genres:
            raise HTTPException(status_code=400, detail="Title, Author, and Genre are required")
        if len(book.title) > 100:
            raise HTTPException(status_code=400, detail="Title cannot be longer than 100 characters")
        if len(book.author) > 50:
            raise HTTPException(status_code=400, detail="Author cannot be longer than 50 characters")
        return add_book(book)

    def get_book_matches_by_title_query(self, partial_title: str, max_num: Optional[int] = None):
        if not partial_title:
            raise HTTPException(status_code=400, detail="Partial title is required for search")
        books = get_book_matches_by_title(partial_title,max_num)
        return books
    
    def get_all_titles_query(self):
        # Retrieve all book titles
        return get_all_titles()
    # ENDREGION
    
    # # REGION 6.1 search by id
    # def get_book_by_id_query(self, book_id: str):
    #     # Validate that the book_id is not empty
    #     if not book_id:
    #         raise HTTPException(status_code=400, detail="Book ID is required")
    #     # Get book by ID
    #     book = get_book_by_id(book_id)
    #     if book == -1:
    #         raise HTTPException(status_code=404, detail="Book not found")
    #     return book

    # def get_book_by_title_query(self, title: str):
    #     # Validate that the title is not empty
    #     if not title:
    #         raise HTTPException(status_code=400, detail="Title is required")
    #     # Get book by title
    #     book = get_book_by_title(title)
    #     if book == -1:
    #         raise HTTPException(status_code=404, detail="Book not found")
    #     return book

    # def get_books_by_author_query(self, author: str):
    #     # Validate that the author is not empty
    #     if not author:
    #         raise HTTPException(status_code=400, detail="Author name is required")
    #     # Get books by author
    #     books = get_books_by_author(author)
    #     if books == -1:
    #         raise HTTPException(status_code=404, detail="No books found for this author")
    #     return books
    # # ENDREGION
    