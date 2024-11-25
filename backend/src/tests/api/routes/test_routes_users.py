from src.main import app
from src import crud
from src.models.user_model import User
import uuid


import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

def test_get_username_with_valid_id(client: TestClient):
    user_data = {"email":"getUsernameById@mail.com","username":"getUsernameById","password":"dumbPassword"}
    user = User(**user_data)
    created_user = crud.user.create_user(user)
    response = client.get(f"/users/username/id/{created_user.id}")
    crud.user.delete_user(created_user.id)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}. Details: {response.json()}"  
    assert response.json() == created_user.username  

def test_get_username_with_invalid_id(client: TestClient):
    id = str(uuid.uuid4())
    response = client.get(f"/users/username/id/{id}")
    assert response.status_code == 404, f"Expected 404, got {response.status_code}. Details: {response.json()}"  