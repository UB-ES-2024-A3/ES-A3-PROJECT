from fastapi import HTTPException
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
        result = supabase.table("book_lists").delete().eq("id", list_id).execute()

        return True
    except Exception as e:
        print(f"Error deleting list with id {list_id}: {e}")
        return False
