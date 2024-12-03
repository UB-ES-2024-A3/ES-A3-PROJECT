import { renderStars } from "./stars_rating";
import { useRouter } from "next/router";
import { useTimelineContext } from "@/contexts/TimelineContext";

interface ProfileReviewCardProps {
  bookTitle: string;
  author: string;
  rating: number;
  review?: string;
  date?: string;
  time?: string;
  book_id: string;
}

export default function ProfileReviewCard({ bookTitle, author, rating, review, date, time, book_id }: ProfileReviewCardProps) {
  const router = useRouter();
  const {setTimelineState} = useTimelineContext();

  const handleClickTitle = () =>{
    setTimelineState({page: 'book', data: book_id});
    router.push("/timeline/book/" + book_id)
  }
  return (
    <div style={{ height: "fit-content", minWidth: "100%", margin: "0 auto", padding: "24px", borderRadius: "8px", backgroundColor: "white"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <button className="secondaryButton titleButton" id={book_id} onClick={handleClickTitle}>
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
      
    </div>
  )
}
