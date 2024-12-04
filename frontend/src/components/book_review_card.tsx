import { renderStars } from "./stars_rating";
import { useRouter } from "next/router";
import { useTimelineContext } from "@/contexts/TimelineContext";
import ReviewService from "@/services/reviewService";

export interface BookReviewCardProps {
  id: string,
  userId: string,
  username: string,
  stars: number,
  comment?: string,
  date?: string,
  time?: string,
  callback: (review_id: string) => void
}

export default function BookReviewCard({ id, userId, username, stars, comment, date, time, callback }: BookReviewCardProps) {
  const router = useRouter();
  const {setTimelineState} = useTimelineContext();
  const isCurrentUser = localStorage.getItem('userId') === userId;

  const handleClickTitle = () =>{
    setTimelineState({page: 'user', data: userId});
    router.push("/timeline/user/" + userId)
  }

  const handleClickDelete = () => {
    ReviewService.deleteReviewRequest(id)
    .then(isDeleted => {
      if (isDeleted) {
        callback(id);
      }
    });
  };

  return (
    <div style={{
      height: "fit-content",
      minWidth: "100%",
      margin: "0 auto",
      padding: "24px",
      border: 'outset gray 2px',
      borderRadius: "16px",
      backgroundColor: "white"
    }} className="review-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <button className="secondaryButton usernameButton" style={{ padding: "inherit"}} onClick={handleClickTitle}>
            {username}
          </button>
          <div style={{ display: "flex", marginTop: "8px" }}>
            {renderStars(stars)} 
          </div>
        </div>
        <div style={{ fontSize: "0.875rem", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {date && time && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span style={{ fontWeight: "bold" }}>{date}</span>
              <span style={{ marginLeft: "8px" }}>{time}</span>
            </div>
          )}
        </div>

      </div>
      {comment && (
        <p style={{ lineHeight: "1.625", marginTop: "16px" }}>
          {comment}
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
