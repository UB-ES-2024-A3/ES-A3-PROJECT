import { useRouter } from "next/router";
import ProfileReviewCard from "./profile_review_card";

export interface TimelineReviewProps {
    userId: string,
    username: string,
    rating: number,
    bookId: string,
    bookTitle: string,
    author: string,
    comment?: string,
    date?: string,
    time?: string
}

export default function TimelineReviewCard({ userId, username, bookId, bookTitle, author, rating, comment, date, time }: TimelineReviewProps) {
    const router = useRouter();
    const handleClickUsername = () => {
        // TODO: should redirect to user page
        router.push("/users/" + userId);
    }

    return (
        <div style={{ height: "fit-content", minWidth: "100%", margin: "0 auto", padding: "24px", borderRadius: "8px", backgroundColor: "white"}}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flexGrow: 1 }}>
                    <button className="secondaryButton" style={{ fontWeight: "bold" }} onClick={handleClickUsername}>
                        {username}
                    </button>
                </div>
                {date && time && (
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <span style={{ fontWeight: "bold" }}>{date}</span>
                        <span style={{ marginLeft: "8px" }}>{time}</span>
                    </div>
                )}
            </div>
            <hr />
            <ProfileReviewCard 
                book_id={bookId}
                bookTitle={bookTitle}
                author={author}
                rating={rating}
                review={comment}
            />
            {/* <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "solid black 1px", padding: "16px"}}>
                <div>
                    <button className="secondaryButton" style={{ fontSize: "1.25rem", fontWeight: "bold", display: "contents" }} >
                        {bookTitle}
                    </button>
                    <p style={{ color: "grey", marginTop: "4px" }}>{author}</p>
                </div>
                <div style={{ display: "flex", marginTop: "8px", alignItems: "flex-end" }}>
                    {renderStars(rating)} 
                </div>

            </div>
            {comment && (
                <p style={{ lineHeight: "1.625", marginTop: "16px" }}>
                    {comment}
                </p>
            )} */}
            
        </div>
    );
}
