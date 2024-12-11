from src.models.book_list import BookList
from src.crud.user import search_by_id
from src.crud import book_lists
from fastapi import HTTPException
import uuid

class BookListController:
    def create_list(self, book_list: BookList):
        if len(book_list.name) > 50:
            raise HTTPException(status_code=404, detail="Name cannot be longer than 50 characters")
        user = search_by_id(book_list.user_id)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        
        try:
            created_book = book_lists.create_list(book_list)
            return created_book
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
