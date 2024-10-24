from fastapi import FastAPI
from .api.routes import users

app = FastAPI()

app.include_router(user_controller.router)


@app.get("/")
def read_root():
    return {"message": "API is running!"}
