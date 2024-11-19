import { renderStars } from "./stars_rating";

export interface BookReviewCardProps {
  username: string,
  stars: number,
  comment?: string,
  date?: string,
  time?: string
}

export default function BookReviewCard({ username, stars, comment, date, time }: BookReviewCardProps) {

  return (
    <div style={{
      height: "fit-content",
      minWidth: "100%",
      margin: "0 auto",
      padding: "24px",
      border: 'outset gray 2px',
      borderRadius: "16px",
      backgroundColor: "white"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", display: "inline-block" }}>
            {username}
          </h2>
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
      
    </div>
  )
}