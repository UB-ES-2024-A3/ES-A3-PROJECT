import { renderStars } from "./stars_rating";
import { useRouter } from "next/router";
import { useTimelineContext } from "@/contexts/TimelineContext";
import ReviewService from "@/services/reviewService";

interface ProfileReviewCardProps {
  bookTitle: string;
  author: string;
  rating: number;
  review?: string;
  date?: string;
  time?: string;
  review_id: string;
  book_id: string;
  user_id: string;
  callback: (review_id: string) => void;
}

export default function ProfileReviewCard({ bookTitle, author, rating, review, date, time, book_id, review_id, user_id, callback }: ProfileReviewCardProps) {
  const router = useRouter();
  const {setTimelineState} = useTimelineContext();
  const isCurrentUser = localStorage.getItem('userId') === user_id;

  const handleClickTitle = () =>{
    setTimelineState({page: 'book', data: book_id});
    router.push("/timeline/book/" + book_id)
  };

  const handleClickDelete = () => {
    ReviewService.deleteReviewRequest(review_id)
    .then(isDeleted => {
      if (isDeleted) {
        callback(review_id);
      }
    });
  };

  return (
    <div style={{ height: "fit-content", minWidth: "100%", margin: "0 auto", padding: "24px", borderRadius: "8px", backgroundColor: "white"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <button className="secondaryButton" style={{ fontSize: "1.25rem", fontWeight: "bold", display: "contents" }} onClick={handleClickTitle}>
            {bookTitle}
          </button>
          <p style={{ color: "grey", marginTop: "4px" }}>{author}</p>
        </div>
        <div style={{ fontSize: "0.875rem", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {date && time && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span style={{ fontWeight: "bold" }}>{date}</span>
              <span style={{ marginLeft: "8px" }}>{time}</span>
            </div>
          )}
          <div style={{ display: "flex", marginTop: "8px" }}>
            {renderStars(rating)} 
          </div>
        </div>

      </div>
      {review && (
        <p style={{ lineHeight: "1.625", marginTop: "16px" }}>
          {review}
        </p>
      )}
      {isCurrentUser && (
        <button className="delete-btn" style={{ float: "right" }} onClick={handleClickDelete}>
          Delete
        </button>
      )}
    </div>
  )
}
