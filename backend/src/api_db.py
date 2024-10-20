import os
from supabase import create_client
from dotenv import load_dotenv
from models.user_model import User

# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

# Method to read all users from database
def read_users():
    supabase = get_db_client()
    data = supabase.table("users").select("*").execute()
    return data

# Method to create a new user in the database
def create_user(user: User):
    supabase = get_db_client()
    data = {
        'id': user.id,
        'email': user.email,
        'username': user.username,
        'password': user.password  # You might want to hash the password before storing it
    }
    result = supabase.table("users").insert(data).execute()
    return result

# Method to delete a user by id
def delete_user(user_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("users").delete().eq('id', user_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting user with id {user_id}: {e}")
        return False


usuario = User("usuario@email.com", "nombre_usuario", "password_secreto")
print(usuario)
create_user(usuario)
print(read_users())



