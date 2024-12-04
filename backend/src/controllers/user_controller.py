import re
import uuid

from src.crud.user import *
from fastapi import HTTPException
from src.models.user_model import User
from src.crud import followers


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
    
    def follow_user(self, user_id: str, user_to_follow_id: str):
        # We get both users to compute the new 'followers' and 'following' fields
        user = search_by_id(user_id)
        user_to_follow = search_by_id(user_to_follow_id)

        # Check if user_id is a valid UUID
        if not self.is_valid_uuid(user_id) or not self.is_valid_uuid(user_to_follow_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        if user == -1 or user_to_follow == -1:
            raise HTTPException(status_code=404, detail="User not found")
        try:
            followed = self.check_follower(user_id, user_to_follow_id)
            if followed:
                raise HTTPException(status_code=404, detail="User already followed")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        try:
            # We create a new row in the follower table
            created_follower = followers.create_follower(user_id, user_to_follow_id)
        except Exception as e:
            print(f"An error occurred while inserting the follower: {e}")
            raise HTTPException(status_code=500, detail=str(e))
        
        # We update the 'followers' and 'following' fields
        new_user_following = user.following + 1
        new_user_followers = user_to_follow.followers + 1
        update_follower_fields(user.id, {"following": new_user_following})
        update_follower_fields(user_to_follow.id, {"followers": new_user_followers})
        return created_follower
    
    def check_follower(self, user_id: str, user_to_follow_id: str):
        try:
            followed = followers.get_follower(user_id, user_to_follow_id)
            return followed
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        
    def unfollow_user(self, user_id: str, user_to_unfollow_id: str):
        # We get both users to compute the new 'followers' and 'following' fields
        user = search_by_id(user_id)
        user_to_unfollow = search_by_id(user_to_unfollow_id)

        # Check if user_id is a valid UUID
        if not self.is_valid_uuid(user_id) or not self.is_valid_uuid(user_to_unfollow_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        if user == -1 or user_to_unfollow == -1:
            raise HTTPException(status_code=404, detail="User not found")
        
        try:
            followed = self.check_follower(user_id, user_to_unfollow_id)
            if not followed:
                raise HTTPException(status_code=404, detail="User already followed")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        try:
            # We create a new row in the follower table
            followers.delete_follower(user_id, user_to_unfollow_id)
        except Exception as e:
            print(f"An error occurred while deleting the follower: {e}")
            raise HTTPException(status_code=500, detail=str(e))
        
        # We update the 'followers' and 'following' fields
        new_user_following = user.following - 1
        new_user_followers = user_to_unfollow.followers - 1
        update_follower_fields(user.id, {"following": new_user_following})
        update_follower_fields(user_to_unfollow.id, {"followers": new_user_followers})

        return {"detail": "User unfollowed successfully"}

    def get_user_timeline(self, user_id: str):
        # Check if user_id is a valid UUID
        if not self.is_valid_uuid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        # Check if the user exists by ID
        if self.search_by_id(user_id) == -1:
            raise HTTPException(status_code=404, detail="User not found")
        
        try:
            data = followers.get_timeline(user_id)
            return data
        
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

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
        if (max_num !=  None and max_num <= 0):
            raise HTTPException(
                status_code=400, detail="max_num must be a positive number."
            )
        
        # Delegate to the CRUD layer
        return search_users_by_partial_username_crud(username, max_num)