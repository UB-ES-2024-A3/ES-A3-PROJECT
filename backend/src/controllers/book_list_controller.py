from src.models.book_list import BookList
from src.crud.user import search_by_id
from src.crud import book_lists
from src.crud.book_lists import *
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
            
    def update_book_list_relationship(self, user_id: str, book_id: str, book_list: dict):
        user_lists = get_lists_by_user(user_id)

        user_list_ids = {list_["id"] for list_ in user_lists}

        invalid_lists = set(book_list.keys()) - user_list_ids
        if invalid_lists:
            raise ValueError(f"Invalid list IDs: {invalid_lists}")
        existing_relationships = get_relationships_by_book(book_id, user_list_ids)
        existing_list_ids = {rel["list_id"] for rel in existing_relationships}

        for list_id, should_add in book_list.items():
            if should_add and list_id not in existing_list_ids:
                add_relationship(list_id, book_id)
            elif not should_add and list_id in existing_list_ids:
                remove_relationship(list_id, book_id)


    def get_lists_with_book(self, user_id: str, book_id: str):
        try:
            user_lists = fetch_lists_by_user(user_id)
            
            result = []
            for book_list in user_lists:
                is_in_list = check_book_in_list(book_list['id'], book_id)
                result.append({
                    "list_id": book_list['id'],
                    "name": book_list['name'],
                    "checked": is_in_list
                })
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching lists: {str(e)}")

    def get_user_lists(self, user_id: str):
        # Check if user exists
        user = search_by_id(user_id)
        if user == -1: 
            raise HTTPException(status_code=404, detail="User not found")
        try:
            lists = book_lists.get_user_lists(user_id)
            return lists
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def get_books_in_list(self, list_id: str):
        try:
            username = book_lists.get_username_by_list_id(list_id)
            book_ids = book_lists.get_book_ids_by_list_id(list_id)
            if not book_ids:
                return {"username": username, "books": []}
            books = book_lists.get_books_by_ids(book_ids)
            if books:
                books = sorted(books, key=lambda book: book['title'])
            return {"username": username, "books": books}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching books in list: {str(e)}")
    def is_user_following_list(self, user_id: str, list_id: str) -> bool:
        try:
            return check_existing_follow(user_id, list_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error checking follow status: {str(e)}")