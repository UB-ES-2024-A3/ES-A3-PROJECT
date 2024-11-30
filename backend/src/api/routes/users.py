from fastapi import APIRouter, HTTPException
from typing import List, Optional
from src.models.user_model import User
from src.models.follower_model import Follower
from src.controllers.user_controller import UserController

userController = UserController()
router = APIRouter()

# Endpoint to read all users
@router.get("/users", response_model=List[User])
async def get_all_users():
    try:
        users = userController.read_users_query()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users")

# Endpoint to create a new user
@router.post("/users", response_model=User)
async def add_new_user(user: User):
    try:
        result = userController.create_user_command(user)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error creating user")

# Endpoint to delete a user by id
@router.delete("/users/{user_id}")
async def remove_user(user_id: str):
    try:
        success = userController.delete_user_command(user_id)
        if not success:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": f"User with id {user_id} has been deleted"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting user: {e}")

# Endpoint to search for a user by username
@router.get("/users/username/{username}", response_model=User)
async def get_user_by_username(username: str):
    try:
        user = userController.search_by_username(username)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching user by username")

# Endpoint to search for a user by email
@router.get("/users/email/{email}", response_model=User)
async def get_user_by_email(email: str):
    try:
        user = userController.search_by_email(email)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching user by email")

# Endpoint to search for a user by id
@router.get("/users/id/{user_id}", response_model=User)
async def get_user_by_id(user_id: str):
    try:
        user = userController.search_by_id(user_id)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching user by id")

# Endpoint to get the username given an id   
@router.get("/users/username/id/{user_id}")
async def get_user_data_by_id(user_id: str) -> dict:
    try:
        user = userController.search_by_id(user_id)
        if user == -1:
            raise HTTPException(status_code=404, detail="User not found")
        return {"username": user.username, "followers": user.followers, "following": user.following}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching user by id")


@router.get("/users/search")
async def search_users(username: str, max_num: Optional[int] = None):
    try:
        # Call the controller method
        users = userController.search_users_by_partial_username(username, max_num)
        if not users:  # This will check if the list is empty
            return []
        return users
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users")


# Endpoint to follow a user 
@router.post("/users/follow/{user_id}/{user_to_follow_id}", response_model = Follower)
async def follow_user(user_id: str, user_to_follow_id: str):
    try:
        follower = userController.follow_user(user_id, user_to_follow_id)
        return follower
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error searching user by id")