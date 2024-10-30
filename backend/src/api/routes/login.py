from fastapi import APIRouter, HTTPException, Response
from src import crud

router = APIRouter()
from pydantic import BaseModel

class AuthRequest(BaseModel):
    credentials: str
    password: str
# Endpoint to authenticate a user by username or email
@router.post("/login")
async def authenticate(authRequest: AuthRequest):
    try:
        auth = crud.user.authenticate(authRequest.credentials, authRequest.password)
        if auth:
            return Response(status_code=204)
        else:
            raise HTTPException(status_code=500, detail={"credentials": "Incorrect username/email or password"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))