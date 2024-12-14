import uuid
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
        
def fetch_lists_by_user(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("book_lists").select("*").eq("user_id", user_id).execute()
        return result.data if result.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching lists: {str(e)}")

def check_book_in_list(list_id: str, book_id: str):
    supabase = get_db_client()
    try:
        result = (
            supabase.table("list_book_relationships")
            .select("book_id")
            .eq("list_id", list_id)
            .eq("book_id", book_id)
            .execute()
        )
        return len(result.data) > 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking book in list: {str(e)}")

def get_user_lists(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("book_lists").select("id, name").eq("user_id", user_id).order("name", desc = True).execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail={e})

def get_book_ids_by_list_id(list_id: str):
    supabase = get_db_client()
    try:
        result = (
            supabase.table("list_book_relationships")
            .select("book_id")
            .eq("list_id", list_id)
            .execute()
        )
        return [entry["book_id"] for entry in result.data] if result.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching book IDs: {str(e)}")

def get_books_by_ids(book_ids: list):
    supabase = get_db_client()
    try:
        result = (
            supabase.table("books")
            .select("id, title, author")
            .in_("id", book_ids)
            .execute()
        )
        return result.data if result.data else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching books: {str(e)}")

def get_username_by_list_id(list_id: str):
    supabase = get_db_client()
    try:
        result = (
            supabase.table("book_lists")
            .select("user_id, users(id, username)")
            .eq("id", list_id)
            .execute()
        )
        if not result.data:
            return None
        return result.data[0]["users"]["username"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user: {str(e)}")

def add_follower(user_id: str, list_id: str):
    client = get_db_client()
    data = {"id":str(uuid.uuid4()),"user_id": user_id, "list_id": list_id}
    return client.table("followers_list").insert(data).execute()

def remove_follower(user_id: str, list_id: str):
    client = get_db_client()
    return client.table("followers_list").delete().eq("user_id", user_id).eq("list_id", list_id).execute()
    
def check_existing_follow(user_id: str, list_id: str):
    client = get_db_client()
    result = client.table("followers_list").select("id").eq("user_id", user_id).eq("list_id", list_id).execute()
    return len(result.data) > 0

def check_ownership(user_id: str, list_id: str):
    client = get_db_client()
    result = client.table("book_lists").select("id").eq("user_id", user_id).eq("id", list_id).execute()
    return len(result.data) > 0

def get_lists_user_is_following(user_id: str):
    client = get_db_client()
    
    try:
        result = (
            client.table("book_lists")
            .select("id, name, user_id")
            .eq("user_id", user_id)
            .execute()
        )
        if not result.data:
            return []
        list_data = result.data

        user_ids = list(set(entry["user_id"] for entry in list_data))
        user_details = (
            client.table("users")
            .select("id, username")
            .in_("id", user_ids)
            .execute()
        )
        if not user_details.data:
            return []
        user_map = {user["id"]: user["username"] for user in user_details.data}
        result = [
            {
                "id": list_item["id"],
                "name": list_item["name"],
                "user_id": list_item["user_id"],
                "username": user_map.get(list_item["user_id"], "Unknown")
            }
            for list_item in list_data
        ]
        result.sort(key=lambda x: x["name"].lower())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving followed lists: {str(e)}")