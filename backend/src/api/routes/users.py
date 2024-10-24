from fastapi import APIRouter, HTTPException
from typing import List
from backend.src.crud.user import *

router = APIRouter()

# Endpoint to read all users
@router.get("/users", response_model=List[User])
async def get_all_users():
    try:
        users = read_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users")

# Endpoint to create a new user
@router.post("/users", response_model=User)
async def add_new_user(user: User):
    try:
        result = create_user(user) # TODO: Check what returns
        return result
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
