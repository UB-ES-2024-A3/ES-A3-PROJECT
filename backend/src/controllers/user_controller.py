import re
import uuid

from src.crud.user import *
from fastapi import HTTPException
from src.models.user_model import User


class UserController:

    def read_users_query(self):
        # Calls the API method to read all users
        return read_users()

    def create_user_command(self, user: User):
        # Check email validity
        if not re.match(r"[^@]+@[^@]+\.[^@]+", user.email):
            raise HTTPException(status_code=400, detail="Invalid email format")
        if len(user.email) > 20:
            raise HTTPException(
                status_code=400, detail="Email cannot be longer than 20 characters"
            )

        # Check username length
        if len(user.username) > 15:
            raise HTTPException(
                status_code=400, detail="Username cannot be longer than 15 characters"
            )

        # Check if username and email are unique
        if self.search_by_username(user.username) != -1:
            raise HTTPException(status_code=400, detail="Username already exists")
        if self.search_by_email(user.email) != -1:
            raise HTTPException(status_code=400, detail="Email already exists")

        return create_user(user)

    def delete_user_command(self, user_id: str):
        # Check if user_id is a valid UUID
        if not self.is_valid_uuid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        # Check if the user exists by ID
        if self.search_by_id(user_id) == -1:
            raise HTTPException(status_code=404, detail="User not found")

        # Delete the user
        success = delete_user(user_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete user")

        return {"detail": "User deleted successfully"}

    def search_by_username(self, username: str):
        # Validate username length
        if len(username) > 15:
            raise HTTPException(
                status_code=400, detail="Username cannot be longer than 15 characters"
            )

        # Searches for a user by username
        return search_by_username(username)

    def search_by_email(self, email: str):
        # Check email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise HTTPException(status_code=400, detail="Invalid email format")

        # Searches for a user by email
        return search_by_email(email)

    def search_by_id(self, user_id: str):
        # Check if user_id is a valid UUID
        if not self.is_valid_uuid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        # Searches for a user by ID
        return search_by_id(user_id)

    def is_valid_uuid(self, value: str):
        try:
            uuid.UUID(value)
            return True
        except ValueError:
            return False
    def search_users_by_partial_username(self, username: str, max_num: int):
        # Validate username length
        if len(username) < 1 or len(username) > 15:
            raise HTTPException(
                status_code=400, detail="Username must be between 1 and 15 characters."
            )
        
        # Validate max_num is within the allowed range
        if not (1 <= max_num <= 15):
            raise HTTPException(
                status_code=400, detail="max_num must be between 1 and 15."
            )
        
        # Delegate to the CRUD layer
        return search_users_by_partial_username_crud(username, max_num)