import re
from typing import List, Optional
import unicodedata
from fastapi import HTTPException
from supabase import create_client
from dotenv import load_dotenv
import os
from src.models.book_model import Book


# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

# REGION 5.4 search books by title
# Method that returns all books
def get_all_books():
    try:
        supabase = get_db_client()
        data = supabase.table("books").select("*").execute()
        books = []
        for book_data in data.data:
            if book_data["genres"]:
                genres = [genre.strip() for genre in book_data["genres"].split(",")]
            else:
                genres = []
            book_data["genres"] = genres
            book = Book(**book_data)
            books.append(book)
        return books
    except Exception as e:
        print(f"An error occurred while retrieving books: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Method to add a new book
def add_book(book: Book):
    try:
        supabase = get_db_client()
        data = {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "genres": book.genres,
            "description": book.description,
        }
        result = supabase.table("books").insert(data).execute()
        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error inserting book: No data returned from Supabase",
            )
        created_book = Book(
            id=result.data[0]["id"],
            title=result.data[0]["title"],
            author=result.data[0]["author"],
            genres=book.genres,
            description=result.data[0].get("description"),
        )
        return created_book
    except Exception as e:
        print(f"An error occurred while inserting the book: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Method to search books based on partial name
def get_book_matches_by_title(partial_title: str, max_num: Optional[int] = None) -> List[Book]:
    supabase = get_db_client()
    try:
        def normalize_text(text: str) -> str:
            text = re.sub(r"[^\w\s]", "", text)
            return text.lower().strip()
        
        normalized_partial_title = normalize_text(partial_title)
        rpc_params = {
            "search_term": normalized_partial_title,
            "limit_num": max_num
        }
        result = supabase.rpc("search_books_by_title", rpc_params).execute()
        
        books = []
        if result.data and isinstance(result.data, list):
            for book_data in result.data:
                if "genres" in book_data and book_data["genres"]:
                    genres = [genre.strip() for genre in book_data["genres"].split(",")]
                else:
                    genres = []
                book_data["genres"] = genres
                book = Book(**book_data)
                books.append(book)
        return books
    except Exception as e:
        print(f"Error searching for book titles by partial name '{partial_title}': {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Method to search all books title (in case search_by_name_incomplete is not efficient enought, it can be filtered in frontend)
def get_all_titles():
    supabase = get_db_client()
    try:
        result = supabase.table("books").select("title").execute()
        titles = [book["title"] for book in result.data] if result.data else []
        return titles
    except Exception as e:
        print(f"Error al obtener los títulos de los libros: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Method to get a book by ID
def get_book_by_id(book_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("books").select("*").eq("id", book_id).execute()        
        if result.data:
            book_data = result.data[0]
            if book_data["genres"]:
                genres = [genre.strip() for genre in book_data["genres"].split(",")]
            else:
                genres = [] 
            book_data["genres"] = genres  
            return Book(**book_data)
        else:
            return -1
    except Exception as e:
        print(f"Error retrieving book by id {book_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    # Method to update book attributes
def update_book_attributes(book_id: str, attributes: dict):
    supabase = get_db_client()
    try:
        result = supabase.table("books").update(attributes).eq("id", book_id).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update book attributes")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating book attributes: {str(e)}")