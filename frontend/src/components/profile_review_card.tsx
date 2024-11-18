import { renderStars } from "./stars_rating";

interface ProfileReviewCardProps {
  bookTitle: string;
  author: string;
  rating: number;
  review?: string;
  date?: string,
  time?: string}

export default function ProfileReviewCard({ bookTitle, author, rating, review, date, time }: ProfileReviewCardProps) {

  return (
    <div style={{ height: "fit-content", minWidth: "100%", margin: "0 auto", padding: "24px", borderRadius: "8px", backgroundColor: "white"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", display: "inline-block" }}>
            {bookTitle}
          </h2>
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
      
    </div>
  )
}
