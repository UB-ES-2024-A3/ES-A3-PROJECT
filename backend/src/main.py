from fastapi import FastAPI
from src.api.routes import users, login, books , review
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

#app.include_router(user_controller.router)
app.include_router(users.router)
app.include_router(login.router)
app.include_router(books.router)
app.include_router(review.router)

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
    return {"message": "Hello World!"}
