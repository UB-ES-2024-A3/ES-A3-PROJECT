from fastapi import FastAPI
from src.api.routes import users, login
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

#app.include_router(user_controller.router)
app.include_router(users.router)
app.include_router(login.router)


origins = ["*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main():
    return {"message": "Hola, buenos días"}
