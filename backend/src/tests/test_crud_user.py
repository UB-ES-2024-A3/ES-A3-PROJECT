from backend.src.crud.user import (
    read_users,
    create_user,
    delete_user,
    authenticate
)
from backend.src.models.user_model import User
import random
import pytest

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

def test_authenticate_user_email():
    users = read_users()
    result1 = authenticate(users[0].email, users[0].password)
    result2 = authenticate("nonExistingEmail@gmail.com", "wrongPassword")
    result3 = authenticate(users[0].email, "wrongPassword")
    result4 = authenticate("wrongEmail@gmail.com", users[0].password)
    assert result1 == True, "Error authenticating user with email"
    assert result2 == False
    assert result3 == False
    assert result4 == False

def test_authenticate_user_username():
    users = read_users()
    result1 = authenticate(users[0].username, users[0].password)
    result2 = authenticate("wrongUsername", "wrongPassword")
    result3 = authenticate(users[0].username, "wrongPassword")
    result4 = authenticate("wrongUsername", users[0].password)
    assert result1 == True, "Error authenticating user with username"
    assert result2 == False
    assert result3 == False
    assert result4 == False

test_read_users()

userid = test_create_user()

test_delete_user_success(userid)