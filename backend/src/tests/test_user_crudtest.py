from ..crud.user import *
from ..models.user_model import User
import random

############################################################################################################
# TO RUN THESE TEST INSTALL PYTEST AND RUN pytest .\backend\src\tests\apitests.py
############################################################################################################

# Read all clients from database
def test_read_users():
    users = read_users()
    assert len(users) > 0, "No users found in database"

# Create a user
def test_create_user():
    randomint = random.randint(1, 1000)
    user = User(
        email="test" + str(randomint) + "@example.com",
        username="testuser" + str(randomint),
        password="hashed_password",
    )
    created_user = create_user(user)
    assert created_user is not None, "Failed to create user"
    return created_user.id, created_user.username, created_user.email

# Delete a user by ID
def test_delete_user_success():
    result = delete_user("008741a9-40b6-4cf7-9e83-7aa062fbdffa") # This is only going to work once
    assert result, "Failed to delete user"

# Test search by username (existing user)
def test_search_by_username_existing():
    user = search_by_username("test5")
    assert user != -1, "User not found by existing username"

# Test search by username (non-existing user)
def test_search_by_username_non_existing():
    user = search_by_username("nonexistingusername12345")
    assert user == -1, "Non-existing username returned a user"

# Test search by email (existing user)
def test_search_by_email_existing():
    user = search_by_email("joaquin5@test.com")
    assert user != -1, "User not found by existing email"

# Test search by email (non-existing user)
def test_search_by_email_non_existing():
    user = search_by_email("nonexistingemail12345@example.com")
    assert user == -1, "Non-existing email returned a user"

# Test search by ID (existing user)
def test_search_by_id_existing():
    user = search_by_id("5233dc87-14c8-4ed4-8963-6aa6f7b7634a")
    assert user != -1, "User not found by existing ID"

# Test search by ID (non-existing user)
def test_search_by_id_non_existing():
    user = search_by_id("nonexistingid12345")
    assert user == -1, "Non-existing user ID returned a user"