import os
from fastapi import HTTPException
from supabase import create_client
from dotenv import load_dotenv
from backend.src.models.user_model import User
import re
# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY")) # Keys are in .env

# Method to read all users from database
def read_users():
    supabase = get_db_client()
    data = supabase.table("users").select("*").execute()
    users = [User(**user) for user in data.data]  # Return a list of users
    return users

# Method to create a new user in the database
def create_user(user: User):
    try:
        supabase = get_db_client()
        data = {
            'id': user.id,
            'email': user.email,
            'username': user.username,
            'password': user.password  # FIXME: Should we hash the pwd?
        }
        result = supabase.table("users").insert(data).execute()
        if not result.data:
            raise HTTPException(status_code=500, detail="Error inserting user: No data returned from Supabase")
        created_user = User(
            id=result.data[0]['id'],
            email=result.data[0]['email'],
            username=result.data[0]['username'],
            password=result.data[0]['password']
        )
        return created_user
    except Exception as e:
        print(f"An error occurred while inserting the user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Method to delete a user by id
def delete_user(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("users").delete().eq('id', user_id).execute()
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
        return None

    raise HTTPException(status_code=500, detail={"credentials": "Incorrect username/email or password"})
