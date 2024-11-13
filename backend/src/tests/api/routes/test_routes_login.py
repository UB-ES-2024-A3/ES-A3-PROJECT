from src.main import app
from src import crud


import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

def test_authenticate_correct_user_email(client: TestClient):
    users = crud.user.read_users()
    data = {"credentials" : users[0].email, "password": users[0].password}
    r = client.post(f"/login", json = data)
    assert r.status_code == 204, f"Expected 204, got {r.status_code}. Details: {r.json()}"


def test_authenticate_correct_user_username(client: TestClient):
    users = crud.user.read_users()
    data = {"credentials": users[0].username, "password": users[0].password}
    r = client.post(f"/login", json = data)
    assert r.status_code == 204, f"Expected 204, got {r.status_code}. Details: {r.json()}"

def test_authenticate_wrong_user(client: TestClient):
    data = {"credentials": "wrong@gmail.com", "password": "wrongPassword"}
    try:
        r = client.post(f"/login", json = data)
    except Exception as e:
        assert e.detail == "Incorrect username/email or password"

def test_authenticate_wrong_user_email(client: TestClient):
    users = crud.user.read_users()
    data = {"credentials": "wrong@gmail.com", "password": users[0].password}
    try:
        r = client.post(f"/login", json = data)
    except Exception as e:
        assert e.detail == "Incorrect username/email or password"

def test_authenticate_wrong_user_username(client: TestClient):
    users = crud.user.read_users()
    data = {"credentials": "wrongUsername", "password": users[0].password}
    try:
        r = client.post(f"/login", json = data)
    except Exception as e:
        assert e.detail == "Incorrect username/email or password"

def test_authenticate_wrong_user_password(client: TestClient):
    users = crud.user.read_users()
    data = {"credentials": users[0].username, "password": "wrongPassword"}
    try:
        r = client.post(f"/login", json = data)
    except Exception as e:
        assert e.detail == "Incorrect username/email or password"