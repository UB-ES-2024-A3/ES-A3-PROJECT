from typing import Dict
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from src.models.book_list import BookList
from src.controllers.book_list_controller import BookListController

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
async def update_book_lists(request: Request):
    try:
        # Parse the JSON body
        body = await request.json()
        user_id = body.get("user_id")
        book_id = body.get("book_id")
        book_list = body.get("book_list")
        bookListController.update_book_list_relationship(user_id, book_id, book_list)
        return True
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error updating book list relationships: {e}"
        )

@router.get("/user/booklists", response_model=list)
async def get_user_book_lists(user_id: str, book_id: str):
    try:
        result = bookListController.get_lists_with_book(user_id, book_id)
        return result
    except HTTPException as e:
        raise HTTPException(status_code=500, detail="Error fetching book lists")
      
@router.get("/bookList/{user_id}")
async def get_user_lists(user_id: str):
    try:
        result = bookListController.get_user_lists(user_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching lists")
    
@router.get("/bookList/{list_id}/books", response_model=dict)
async def get_books_in_list(list_id: str):
    try:
        result = bookListController.get_books_in_list(list_id)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books in list: {str(e)}")