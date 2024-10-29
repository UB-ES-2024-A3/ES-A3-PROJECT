from fastapi import FastAPI
from .api.routes import users, login

app = FastAPI()

#app.include_router(user_controller.router)
app.include_router(users.router)
app.include_router(login.router)


@app.get("/")
def read_root():
    return {"message": "API is running!"}
