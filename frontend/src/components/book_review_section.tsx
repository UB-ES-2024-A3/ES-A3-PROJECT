import React from "react";
import { useState, useEffect } from "react";
import BookReviewCard from "./book_review_card";
import ShowBookService from "@/services/showBookService";

interface BookReviewSectionFields {
    id: string
}

interface ReviewData {
    username: string,
    rating: number,
    review?: string,
    date?: string,
    time?: string
}

const BookReviewSection: React.FC<BookReviewSectionFields> = ({ id }) => {
    const [reviews, setReviews] = useState<ReviewData[]>([]);

    useEffect(() => {
        ShowBookService.getBookReviews(id)
            .then(reviewList => {
                setReviews(reviewList);
            })
            .catch(except => {
                console.log(except);
                setReviews([]);
            });
    }, [id]);

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
