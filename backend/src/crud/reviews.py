from datetime import datetime
from fastapi import HTTPException
from src.models.review_model import Review
from supabase import create_client
from dotenv import load_dotenv
import os
import pytz

# Getter client
def get_db_client():
    load_dotenv()
    return create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

def add_review_to_db(review: Review):
    try:
        supabase = get_db_client()
        tz = pytz.timezone('Europe/Madrid') # Set timezone to spain (ignore system datetime)  (CET Time is  GMT+1)
        now = datetime.now(tz)
        current_date = now.date().isoformat()  # Current date in ISO format
        current_time = now.time().isoformat()[:5]  # Current time in ISO and format (HH:mm)
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
    
# Get a review with a particular id
def get_review_by_id(review_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("reviews").select().eq("id", review_id).execute()
        if result.data:
            return Review(**result.data[0])
        else:
            return -1
    except Exception as e:
        print(f"Error finding review with id {review_id}: {e}")
    
# Get all reviews for a given book
def get_book_reviews(book_id: str):
    supabase = get_db_client()
    try:
        reviews = supabase.table("reviews").select('id,comment,stars,date, time, user_id, book_id, users(id, username)').eq("book_id", book_id).order('date',desc= True).order('time', desc = True).execute()
        if reviews.data:
            return reviews.data
        else:
            return []
    except Exception as e:
        print(f"Error finding reviews for book with id {book_id}: {e}")

# Get a book that contains a given review
def get_book_with_review(review_id: str):
    supabase = get_db_client()
    try:
        book_id = supabase.table("reviews").select("book_id").eq("id", review_id).execute()
        if book_id.data:
            return book_id.data[0]['book_id']
        else:
            return -1
    except Exception as e:
        print(f"Error finding book with review {review_id}: {e}")

# Delete review with given id
def delete_review_by_id(review_id: str):
    supabase = get_db_client()
    try:
        result = supabase.table("reviews").delete().eq("id", review_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting review with id {review_id}: {e}")
        return False

def get_user_reviews(user_id: str):
    try:
        supabase = get_db_client()
        reviews = supabase.table("reviews").select('id,comment,stars,date, time, user_id, book_id, books(id, author, title)').eq("user_id", user_id).order('date',desc= True).order('time', desc = True).execute()
        # If reviews are found for that user return a list of the reviews
        if reviews.data:
            return reviews.data
        # If no reviews are found return an empty list
        else:
            return []
    except Exception as e:
        print(f"Error finding reviews for user with id {user_id}: {e}")
