from backend.src.crud.user import *
from backend.src.models.user_model import User
import random

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
# TO RUN THESE TESTS RUN FROM SOURCE python -m backend.src.tests.apitest
##############################################################################


# Read all clients from database
def test_read_users():
    increment_total()
    print("\n\n------------------------------READ USERS TEST-------------------------------")
    users = read_users()
    print(len(users), " users found.")
    print("First user example:")
    print(users[0])
    if len(users) > 0:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Create a user
def test_create_user():
    increment_total()
    print("\n\n------------------------------CREATE NEW USER-------------------------------")
    randomint = random.randint(1, 1000)
    user = User(
        email="test" + str(randomint) + "@example.com",
        username="testuser" + str(randomint),
        password="hashed_password",
    )
    created_user = create_user(user)
    print("Created user: ", created_user)
    if created_user:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")
    return created_user.id, created_user.username, created_user.email


# Delete a user by ID
def test_delete_user_success(user_id):
    increment_total()
    print("\n\n-----------------------------DELETE USER BY ID------------------------------")
    print("UserId to delete:", user_id)
    result = delete_user(user_id)
    if result:
        print("User deleted successfully\nTest passed successfully")
        increment_passed()
    else:
        print("User could not be deleted\nTest failed")


# Test search by username (existing user)
def test_search_by_username_existing(username):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING USERNAME---------------------------")
    user = search_by_username(username)
    print("Found user:", user)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search by username (non-existing user)
def test_search_by_username_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING USERNAME-----------------------")
    user = search_by_username("nonexistingusername12345")
    print("Result for non-existing username:", user)
    if user == -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search by email (existing user)
def test_search_by_email_existing(email):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING EMAIL---------------------------")
    user = search_by_email(email)
    print("Found user:", user)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search by email (non-existing user)
def test_search_by_email_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING EMAIL-----------------------")
    user = search_by_email("nonexistingemail12345@example.com")
    print("Result for non-existing email:", user)
    if user == -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search by ID (existing user)
def test_search_by_id_existing(user_id):
    increment_total()
    print("\n\n---------------------------SEARCH BY EXISTING USER ID---------------------------")
    user = search_by_id(user_id)
    print("Found user:", user)
    if user != -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Test search by ID (non-existing user)
def test_search_by_id_non_existing():
    increment_total()
    print("\n\n---------------------------SEARCH BY NON-EXISTING USER ID-----------------------")
    user = search_by_id("nonexistingid12345")
    print("Result for non-existing user ID:", user)
    if user == -1:
        print("Test passed successfully")
        increment_passed()
    else:
        print("Test failed")


# Ejecución de los tests
test_read_users()
user_id, username, email = test_create_user()
test_search_by_username_existing(username)
test_search_by_username_non_existing()
test_search_by_email_existing(email)
test_search_by_email_non_existing()
test_search_by_id_existing(user_id)
test_search_by_id_non_existing()
test_delete_user_success(user_id)

# Mostrar resultados finales
print(f"\n\n---------------------------- TESTS PASSED {tests_passed}/{total_tests} ----------------------------")
