from datetime import datetime
from fastapi import HTTPException
from src.models.review_model import Review
from supabase import create_client
from dotenv import load_dotenv
import os

# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def add_review_to_db(review: Review):
    try:
        supabase = get_db_client()
        now = datetime.now()
        current_date = now.date().isoformat()  # Current date in ISO format
        current_time = now.time().isoformat()  # Current time in ISO 
        
        if isinstance(review.comment, property) or review.comment is None:
            comment_value = ""  # Set to empty string if invalid
        else:
            comment_value = str(review.comment)  # Ensure comment is a string
        data = {
            "id":review.id,
            "user_id": review.user_id,
            "book_id": review.book_id,
            "stars": review.stars,
            "comment": comment_value,
            "date":current_date,
            "time":current_time
        }
        print(data)
        result = supabase.table("reviews").insert(data).execute()
        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Error inserting review: No data returned from Supabase",
            )
        return Review(**result.data[0])  # Assuming result contains the newly created review
    except Exception as e:
        print(f"An error occurred while inserting the review: {e}")
        raise HTTPException(status_code=500, detail=str(e))
