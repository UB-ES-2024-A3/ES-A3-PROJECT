import os
from fastapi import HTTPException
from supabase import create_client
from dotenv import load_dotenv
import re
from src.models.user_model import User
import uuid

# Getter client
def get_db_client():
    load_dotenv()
    return create_client(
        os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")
    )  # Keys are in .env


# Method to read all users from database
def read_users():
    supabase = get_db_client()
    data = supabase.table("users").select("*").execute()
    users = [User(**user) for user in data.data]  # Return a list of users
    return users


# Method to search for a user by username
def search_by_username(username: str):
    supabase = get_db_client()
    try:
        result = supabase.table("users").select("*").eq("username", username).execute()
        if result.data:
            return User(**result.data[0])  # Return the first matching user
        else:
            return -1  # Return -1 if no user is found
    except Exception as e:
        print(f"Error searching for user by username {username}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
       
# Method to search for a user by email
def search_by_email(email: str):
    supabase = get_db_client()
    try:
        result = supabase.table("users").select("*").eq("email", email).execute()
        if result.data:
            return User(**result.data[0])  # Return the first matching user
        else:
            return -1  # Return -1 if no user is found
    except Exception as e:
        print(f"Error searching for user by email {email}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Method to search for a user by id
def search_by_id(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("users").select("*").eq("id", user_id).execute()
        if result.data:
            return User(**result.data[0])  # Return the first matching user
        else:
            return -1  # Return -1 if no user is found
    except Exception as e:
        print(f"Error searching for user by id {user_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Method to create a new user in the database
def create_user(user: User):
    try:
        supabase = get_db_client()
        data = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "password": user.password,
        }
        result = supabase.table("users").insert(data).execute()
        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error inserting user: No data returned from Supabase",
            )
        created_user = User(**result.data[0])
        return created_user
    except Exception as e:
        print(f"An error occurred while inserting the user: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Method to delete a user by id
def delete_user(user_id: str):
    supabase = get_db_client()
    try:
        supabase.table("reviews").delete().eq("user_id", user_id).execute()
        supabase.table("users").delete().eq("id", user_id).execute()
        # If a user is deleted it should be deleted from the 'followers' and 'following' lists
        supabase.table("followers").delete().eq("follower_id", user_id).execute()
        supabase.table("followers").delete().eq("followed_id", user_id).execute()

        return True
    except Exception as e:
        print(f"Error deleting user with id {user_id}: {e}")
        return False

# Method that checks if a user with a certain identifier (either email or username) and password exists
def authenticate(identifier: str, password: str):
    supabase = get_db_client()
    if(re.search(r'@', identifier)):
        try:
            # Result will have a single value in the data array as users are unique
            result = supabase.table("users").select('*').eq('email', identifier).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        try:
            result = supabase.table("users").select('*').eq('username', identifier).execute()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    # If result data is empty the user with the specified identifier doesn't exist.
    # If the user exists in the db we check if the password is correct.
    if(result.data != [] and result.data[0]['password'] == password):
        return result.data[0]['id']
    return False


def search_users_by_partial_username_crud(username: str, max_num: int):
    try:
        supabase = get_db_client()
        result = supabase.rpc(
            "search_similar_users",
            {
                "search_term": username,
                "limit_num": max_num
            }
        ).execute()
        users = result.data
        return [
            {
                "username": user["username"],
                "user_id": uuid.UUID(user["user_id"])
            } for user in users
        ]
    except Exception as e:
        print(f"Error fetching users from the database: {e}")
        raise HTTPException(status_code=500, detail="Error fetching users from the database")

# Method to update the 'followers' and 'following' fields
def update_follower_fields(user_id: str, attributes: dict):
    supabase = get_db_client()
    try:
        result = supabase.table("users").update(attributes).eq("id", user_id).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update user attributes")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating user attributes: {str(e)}")


