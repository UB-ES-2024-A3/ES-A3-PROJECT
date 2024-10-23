from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from backend.src.api_db import (
    read_users,
    create_user,
    delete_user,
) 
from backend.src.models.user_model import User
import random

##############################################################################
# TO RUN THESE TESTS RUN FROM SOURCE python -m backend.test.apitests
##############################################################################


# Read all clients from database
def test_read_users():
    print("\n\n------------------------------READ USERS TEST-------------------------------")
    users = read_users()
    print(len(users)," users found.")
    print("First user example:")
    print(users[0])
    if(len(users) > 0):
        print("Test passed successfully")
    else:
        print("Test failed")        

# Create a user
def test_create_user():
    # Generar un número entero aleatorio entre 1 y 1000
    print("\n\n------------------------------CREATE NEW USER-------------------------------")
    randomint = random.randint(1, 1000)
    user = User(
        email="test"+str(randomint)+"@example.com",
        username="testuser"+str(randomint),
        password="hashed_password",
    )
    created_user = create_user(user)
    print("Created user: ",created_user)
    if(created_user):
        print("Test passed successfully")
    else:
        print("Test failed")  
    return created_user.id


# You have to create a new user and extract id to test this
# @patch("your_module.get_db_client")
def test_delete_user_success(userId):
    print("\n\n-----------------------------DELETE USER BY ID------------------------------")
    # Mocking the response from Supabase
    print("UserId to delete:",userId)
    result = delete_user(userId)#<-- put here id
    if(result):
        print("User deleted successfully\nTest passed successfully")
    else:
        print("User could not be deleted\nTest failed")

test_read_users()

userid = test_create_user()

test_delete_user_success(userid)