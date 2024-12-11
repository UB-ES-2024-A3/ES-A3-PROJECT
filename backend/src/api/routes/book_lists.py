from typing import Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.models.book_list import BookList
from src.controllers.book_list_controller import BookListController


class UpdateBookListRequest(BaseModel):
    user_id: str
    book_id: str
    book_list: Dict[str, bool]
    
bookListController = BookListController()
router = APIRouter()

# Endpoint to create a new list
@router.post("/bookList", response_model=BookList)
async def add_new_book(book_list: BookList):
    try:
        result = bookListController.create_list(book_list)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating list")
    
@router.post("/booklist/update")
async def update_book_lists(request: UpdateBookListRequest):
    
    try:
        bookListController.update_book_list_relationship(request.user_id, request.book_id, request.book_list)
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating book list relationships: {e}")
    
