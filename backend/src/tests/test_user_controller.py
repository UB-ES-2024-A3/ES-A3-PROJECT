import pytest
from src.controllers.user_controller import UserController
from src.models.user_model import User
import random
from fastapi import HTTPException
userController = UserController()

############################################################################################################
# TO RUN THESE TEST INSTALL PYTEST AND RUN pytest .\backend\src\tests\user_controllertest.py
############################################################################################################

# Test read_users_query
def test_read_users_query():
    users = userController.read_users_query()
    assert len(users) > 0, "No users found in query"

# Test create_user_command with valid user
def test_create_user_command_valid():
    randomint = random.randint(1, 1000)
    user = User(
        email=f"test{randomint}@example.com",
        username=f"testuser{randomint}",
        password="hashed_password",
    )
    created_user = userController.create_user_command(user)
    assert created_user is not None, "Failed to create user"

# Test create_user_command with invalid email format
def test_create_user_command_invalid_email_format():
    user = User(
        email="invalid_email_format",
        username="validusername",
        password="hashed_password",
    )
    with pytest.raises(HTTPException):
        userController.create_user_command(user)

# Test create_user_command with overly long email
def test_create_user_command_long_email():
    user = User(
        email="toolongemailaddress@example.com".ljust(30, "a"),
        username="uniqueusername",
        password="hashed_password",
    )
    with pytest.raises(HTTPException):
        userController.create_user_command(user)

# Test create_user_command with overly long username
def test_create_user_command_long_username():
    user = User(
        email="valid@example.com",
        username="thisisaverylongusername",
        password="hashed_password",
    )
    with pytest.raises(HTTPException):
        userController.create_user_command(user)

# Test create_user_command with duplicate email
def test_create_user_command_duplicate_email():
    user = User(
        email="joaquin5@test.com",
        username="anotherusername",
        password="hashed_password",
    )
    with pytest.raises(HTTPException):
        userController.create_user_command(user)

# Test create_user_command with duplicate username
def test_create_user_command_duplicate_username():
    user = User(
        email="uniqueemail@example.com",
        username="test5",
        password="hashed_password",
    )
    with pytest.raises(HTTPException):
        userController.create_user_command(user)

# Test delete_user_command with existing user
# def test_delete_user_command_existing():
#     result = userController.delete_user_command("008741a9-40b6-4cf7-9e83-7aa062fbdffa") # This is only going to work once
#     assert result, "Failed to delete existing user"

# Test delete_user_command with non-existing user
def test_delete_user_command_non_existing():
    with pytest.raises(HTTPException):
        userController.delete_user_command("008741a9-40b6-4cf7-9e83-7aa062fbd777")

# Test search_by_username with existing username
def test_search_by_username_existing():
    user = userController.search_by_username("test7")
    assert user != -1, "Existing username not found"

# Test search_by_username with non-existing username
def test_search_by_username_non_existing():
    user = userController.search_by_username("nonexist12345")
    assert user == -1, "Non-existing username returned a user"

# Test search_by_email with existing email
def test_search_by_email_existing():
    user = userController.search_by_email("joaquin5@test.com")
    assert user != -1, "Existing email not found"

# Test search_by_email with non-existing email
def test_search_by_email_non_existing():
    user = userController.search_by_email("nonexistingemail12345@example.com")
    assert user == -1, "Non-existing email returned a user"

# Test search_by_id with existing user id
def test_search_by_id_existing():
    user = userController.search_by_id("5233dc87-14c8-4ed4-8963-6aa6f7b7634a")
    assert user != -1, "Existing user ID not found"

# Test search_by_id with non-existing user id
def test_search_by_id_non_existing():
    user = userController.search_by_id("329144a5-8509-4bc8-a4be-047598035777")
    assert user == -1, "Non-existing user ID returned a user"

# Test search_by_id with invalid UUID
def test_search_by_id_invalid_uuid():
    with pytest.raises(HTTPException):
        userController.search_by_id("invalid-uuid")