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
        created_follower = Follower(**result.data[0])
        return created_follower
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def get_follower(user_id: str, followed_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("followers").select('*').eq("follower_id", user_id).eq("followed_id", followed_id).execute()
        # If user not found return False as user doesn't follow other user
        if not result.data:
            return False
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def get_timeline(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.rpc(
            "get_timeline",
            {
                "given_id": user_id
            }
        ).execute()
        timeline = result.data
        return timeline
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching data from the database")
