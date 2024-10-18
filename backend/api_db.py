import os
from supabase import create_client
from dotenv import load_dotenv

def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def read_users():
    supabase = get_db_client()
    data = supabase.table("users").select("*").execute()
    return data



