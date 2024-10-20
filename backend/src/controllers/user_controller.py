from fastapi import APIRouter, HTTPException
from typing import List
from ..models.user_model import User
from ..api_db import *

router = APIRouter()

# Endpoint to read all users
@router.get("/users", response_model=List[User])
async def get_all_users():
    try:
        users = read_users()
        return users.data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users")

# Endpoint to create a new user
@router.post("/users", response_model=User)
async def add_new_user(user: User):
    try:
        result = create_user(user) # TODO: Check what returns
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating user")

# Endpoint to delete a user by id
@router.delete("/users/{user_id}")
async def remove_user(user_id: str):
    try:
        success = delete_user(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": f"User with id {user_id} has been deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {e}")
