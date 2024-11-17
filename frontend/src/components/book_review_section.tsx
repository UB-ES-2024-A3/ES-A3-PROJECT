import React from "react";
import BookReviewCard from "./book_review_card";

interface BookReviewSectionFields {
    id: string
}

const BookReviewSection: React.FC<BookReviewSectionFields> = ({ id }) => {
    const reviews = [
        {
            username: "avid.reader",
            rating: 5,
            date: '11/02/2022',
            time: '13:30:28',
            review: 'With all due respect: Raughh... Grrrr...'
        },
        {
            username: "tomatoface",
            rating: 4,
            date: '11/02/2022',
            time: '14:00:03',
        },
        {
            username: "hater",
            rating: 1,
            date: '15/2/2022',
            time: '13:30:28',
            review: 'Didn\'t like it one bit.'
        },
    ];

    return (
        <div style={{
            display: 'flex',
            height:'fit-content',
            justifyContent: 'center',
            width: '100%',
            padding: '1.5rem',
        }}>
            <div style={{
                borderTop: 'solid black 2px',
                width: '100%',
                maxWidth: '70%'
            }}>
                <h3 style={{
                    fontSize: '2rem',
                    color: '#4b5563',
                    marginBottom: '1rem',
                }}>
                    Reviews&ensp;-&ensp;
                    <span style={{ fontSize: '1.5rem' }}>
                        { reviews.length } reviews
                    </span>
                </h3>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: '16px',
                    overflowY: 'visible'
                }}>
                    {reviews.length? (reviews.map((review, index) => (
                            <BookReviewCard
                                key={index}
                                username={review.username}
                                rating={review.rating}
                                review={review.review}
                                date={review.date}
                                time={review.time}
                            />
                        ))) : (
                            <div style={{ textAlign: 'center' }}>
                                <h2 style={{fontSize: '2em', color: 'grey'}}>There are no reviews yet.</h2>
                            </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookReviewSection;
