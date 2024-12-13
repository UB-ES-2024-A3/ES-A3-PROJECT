from fastapi import HTTPException
from src.models.list_book_relationship import ListBookRelationship
from src.models.book_list import BookList
from supabase import create_client
from dotenv import load_dotenv
import os

# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def create_list(book_list: BookList):
    supabase = get_db_client()
    try:
        data = {
            "id": book_list.id,
            "name": book_list.name,
            "user_id": book_list.user_id
        }
        result = supabase.table("book_lists").insert(data).execute()
        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error inserting list: No data returned from Supabase",
            )
        created_list = BookList(**result.data[0])
        return created_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"A list with this name already exists")

def delete_list(list_id: str):
    supabase = get_db_client()
    try:
        supabase.table("book_lists").delete().eq("id", list_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting list with id {list_id}: {e}")
        return False
def get_lists_by_user(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("book_lists").select("*").eq("user_id", user_id).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lists for user: {e}")

def get_relationships_by_book(book_id: str, list_ids: set):
    supabase = get_db_client()
    try:
        result = supabase.table("list_book_relationships").select("*").eq("book_id", book_id).in_("list_id", list_ids).execute()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching relationships for book: {e}")

def add_relationship(_list_id: str, _book_id: str):
    supabase = get_db_client()
    try:
        relation_ship = ListBookRelationship(list_id=_list_id, book_id=_book_id)
        data = {
            "id": relation_ship.id,
            "list_id":  relation_ship.list_id,
            "book_id":  relation_ship.book_id
        }
        result = supabase.table("list_book_relationships").insert(data).execute()

        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error adding relationship: No data returned from Supabase",
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding relationship: {e}")

def remove_relationship(list_id: str, book_id: str):
    supabase = get_db_client()
    try:
        supabase.table("list_book_relationships").delete().eq("list_id", list_id).eq("book_id", book_id).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing relationship: {e}")
def get_user_lists(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("book_lists").select("id, name").eq("user_id", user_id).order("name", desc = True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail={e})
      