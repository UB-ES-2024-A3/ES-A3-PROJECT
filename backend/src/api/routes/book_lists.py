from fastapi import APIRouter, HTTPException
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