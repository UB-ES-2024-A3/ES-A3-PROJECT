import uuid
from backend.src.controllers.user_controller import UserController
from backend.src.models.user_model import User
import random
from fastapi import HTTPException

# Contadores de pruebas
tests_passed = 0
total_tests = 0

def increment_passed():
    global tests_passed
    tests_passed += 1

def increment_total():
    global total_tests
    total_tests += 1

##############################################################################
# TO RUN THESE TESTS RUN FROM SOURCE python -m backend.src.tests.test_user_controller
##############################################################################


# Test read_users_query
def test_read_users_query():
    increment_total()
    print("\n\n---------------------------READ USERS QUERY TEST---------------------------")
    users = UserController.read_users_query()
    print(f"Found {len(users)} users.")
    if len(users) > 0:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test create_user_command with valid user
def test_create_user_command_valid():
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND VALID-------------------------")
    randomint = random.randint(1, 1000)
    user = User(
        email=f"test{randomint}@example.com",
        username=f"testuser{randomint}",
        password="hashed_password",
    )
    try:
        created_user = UserController.create_user_command(user)
        print("Created user:", created_user)
        if created_user:
            print("Test passed successfully")
            increment_passed()
        return created_user.id, created_user.username, created_user.email
    except HTTPException as e:
        print("Test failed with error:", e.detail)


# Test create_user_command with invalid email format
def test_create_user_command_invalid_email_format():
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND INVALID EMAIL FORMAT----------------")
    user = User(
        email="invalid_email_format",
        username="validusername",
        password="hashed_password",
    )
    try:
        UserController.create_user_command(user)
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test create_user_command with overly long email
def test_create_user_command_long_email():
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND LONG EMAIL----------------")
    user = User(
        email="toolongemailaddress@example.com".ljust(30, "a"),
        username="uniqueusername",
        password="hashed_password",
    )
    try:
        UserController.create_user_command(user)
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test create_user_command with overly long username
def test_create_user_command_long_username():
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND LONG USERNAME----------------")
    user = User(
        email="valid@example.com",
        username="thisisaverylongusername",
        password="hashed_password",
    )
    try:
        UserController.create_user_command(user)
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test create_user_command with duplicate email
def test_create_user_command_duplicate_email(email):
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND DUPLICATE EMAIL----------------")
    user = User(
        email=email,
        username="anotherusername",
        password="hashed_password",
    )
    try:
        UserController.create_user_command(user)
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test create_user_command with duplicate username
def test_create_user_command_duplicate_username(username):
    increment_total()
    print("\n\n---------------------------CREATE USER COMMAND DUPLICATE USERNAME----------------")
    user = User(
        email="uniqueemail@example.com",
        username=username,
        password="hashed_password",
    )
    try:
        UserController.create_user_command(user)
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test delete_user_command with existing user
def test_delete_user_command_existing(user_id):
    increment_total()
    print("\n\n---------------------------DELETE USER COMMAND EXISTING----------------------")
    result = UserController.delete_user_command(user_id)
    if result:
        print("User deleted successfully\nTest passed successfully")
        increment_passed()
    else:
        print("User could not be deleted\nTest failed")


# Test delete_user_command with non-existing user
def test_delete_user_command_non_existing():
    increment_total()
    print("\n\n---------------------------DELETE USER COMMAND NON-EXISTING-------------------")
    try:
        UserController.delete_user_command("nonexistingid123")
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Test search_by_username with existing username
def test_search_by_username_existing(username):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING USERNAME-------------------------")
    user = UserController.search_by_username(username)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search_by_username with non-existing username
def test_search_by_username_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING USERNAME-----------------------")
    try:
        user = UserController.search_by_username("nonexist12345")
        if user == -1:
            print("Test passed successfully")
            increment_passed()
        else:
            print("Test failed")
    except HTTPException as e:
        print("Test failed with error:", e.detail)


# Test search_by_email with existing email
def test_search_by_email_existing(email):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING EMAIL---------------------------")
    user = UserController.search_by_email(email)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search_by_email with non-existing email
def test_search_by_email_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING EMAIL-----------------------")
    try:
        user = UserController.search_by_email("nonexistingemail12345@example.com")
        if user == -1:
            print("Test passed successfully")
            increment_passed()
        else:
            print("Test failed")
    except HTTPException as e:
        print("Test failed with error:", e.detail)


# Test search_by_id with existing user id
def test_search_by_id_existing(user_id):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING USER ID---------------------------")
    user = UserController.search_by_id(user_id)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search_by_id with non-existing user id
def test_search_by_id_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING USER ID-----------------------")
    try:
        user = UserController.search_by_id("329144a5-8509-4bc8-a4be-047598035777")
        if user == -1:
            print("Test passed successfully")
            increment_passed()
        else:
            print("Test failed")
    except HTTPException as e:
        print("Test failed with error:", e.detail)


# Test search_by_id with invalid UUID
def test_search_by_id_invalid_uuid():
    increment_total()
    print("\n\n---------------------------SEARCH BY INVALID USER ID-----------------------")
    try:
        UserController.search_by_id("invalid-uuid")
        print("Test failed")
    except HTTPException as e:
        print("Caught expected HTTPException:", e.detail)
        print("Test passed successfully")
        increment_passed()


# Run tests
test_read_users_query()
user_id, username, email = test_create_user_command_valid()
test_create_user_command_invalid_email_format()
test_create_user_command_long_email()
test_create_user_command_long_username()
test_create_user_command_duplicate_email(email)
test_create_user_command_duplicate_username(username)
test_search_by_username_existing(username)
test_search_by_username_non_existing()
test_search_by_email_existing(email)
test_search_by_email_non_existing()
test_search_by_id_existing(user_id)
test_search_by_id_non_existing()
test_search_by_id_invalid_uuid()
test_delete_user_command_existing(user_id)
test_delete_user_command_non_existing()

# Mostrar resultados finales
print(f"\n\n---------------------------- TESTS PASSED {tests_passed}/{total_tests} ----------------------------")
