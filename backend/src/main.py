from fastapi import FastAPI
from .controllers import user_controller
app = FastAPI()

app.include_router(user_controller.router)


@app.get("/")
def read_root():
    return {"message": "API is running!"}
