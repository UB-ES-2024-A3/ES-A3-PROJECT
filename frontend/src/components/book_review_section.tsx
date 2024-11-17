import React from "react";
import { useState, useEffect } from "react";
import BookReviewCard from "./book_review_card";
import { BookReviewCardProps } from "./book_review_card";
import ShowBookService from "@/services/showBookService";

interface BookReviewSectionFields {
    id: string
}

// TODO: change id to book when US7 is merged
const BookReviewSection: React.FC<BookReviewSectionFields> = ({ id }) => {
    const [reviews, setReviews] = useState<BookReviewCardProps[]>([]);
    const [numReviews, setNumReviews] = useState<number>(0);

    useEffect(() => {
        ShowBookService.getBookReviews(id)
            .then(reviewList => {
                setReviews(reviewList);
                setNumReviews(reviewList.length);
            })
            .catch(except => {
                console.log(except);
                setReviews([]);
            });
    }, [id]);

    // TODO: extract number of reviews from book

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
                        { numReviews } reviews
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
