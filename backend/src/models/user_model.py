import uuid
from pydantic import BaseModel


class User(BaseModel):
    # Constructor
    def __init__(self, email: str, username: str, password: str):
        self._id = (
            uuid.uuid4()
        )  # Generates an UUID with format: xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
        self._email = email
        self._username = username
        self._password = password

    # Getters
    @property
    def id(self) -> str:
        return str(self._id)  # String to simplify management

    @property
    def email(self) -> str:
        return self._email

    @property
    def username(self) -> str:
        return self._username

    @property
    def password(self) -> str:
        return self._password

    def __repr__(self):
        return f"User(id={self.id}, email='{self.email}', username='{self.username}', password='{self.password}')"

    class Config:
        orm_mode = True
