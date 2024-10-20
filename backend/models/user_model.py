class User:
    # Constructor
    def __init__(self, id: int, email: str, username: str, password: str):
        self._id = id
        self._email = email
        self._username = username
        self._password = password

    # Getters 
    @property
    def id(self) -> int:
        return self._id

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
