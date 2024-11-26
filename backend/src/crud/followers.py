import os
from fastapi import HTTPException
from supabase import create_client
from dotenv import load_dotenv
import re
from src.models.follower_model import Follower


# Getter client
def get_db_client():
    load_dotenv()
    return create_client(
        os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")
    )  # Keys are in .env


# Method to read all users from database
def create_follower(follower_id: str, followed_id: str):
    supabase = get_db_client()
    try:
        data = {
            "follower_id": follower_id,
            "followed_id": followed_id
        }
        result = supabase.table("followers").insert(data).execute()
        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error inserting follower: No data returned from Supabase",
            )
        created_follower = Follower(follower_id = result.data[0]["follower_id"], followed_id = result.data[0]["followed_id"])
        return created_follower
    except Exception as e:
        print(f"An error occurred while inserting the follower: {e}")
        raise HTTPException(status_code=500, detail=str(e))