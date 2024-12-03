import { useRouter } from "next/router";
import ProfileReviewCard from "./profile_review_card";
import { useTimelineContext } from "@/contexts/TimelineContext";

export interface TimelineReviewProps {
    user_id: string,
    username: string,
    rating: number,
    book_id: string,
    title: string,
    author: string,
    description?: string,
    date?: string,
    time?: string
}

export default function TimelineReviewCard({ user_id, username, book_id, title, author, rating, description: comment, date, time }: TimelineReviewProps) {
    const router = useRouter();
    const {setTimelineState} = useTimelineContext();
    const handleClickUsername = () => {
        setTimelineState({page: 'user', data: user_id});
        router.push("/timeline/user/" + user_id);
    }

    return (
        <div style={{ height: "fit-content", minWidth: "100%", margin: "0 auto", padding: "24px", borderRadius: "8px", backgroundColor: "white"}}>
            <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ flexGrow: 1 }}>
                    <button className="secondaryButton usernameButton" onClick={handleClickUsername}>
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
                book_id={book_id}
                bookTitle={title}
                author={author}
                rating={rating}
                review={comment}
            />
        </div>
    );
}
