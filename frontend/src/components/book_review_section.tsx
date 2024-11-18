import React from "react";
import { useState, useEffect } from "react";
import { Book } from "./timeline";
import BookReviewCard from "./book_review_card";
import { BookReviewCardProps } from "./book_review_card";
import AddReviewButton from "./add_review";
import ReviewService from "@/services/reviewService";

interface BookReviewSectionFields {
    book: Book
}

const BookReviewSection: React.FC<BookReviewSectionFields> = ({ book }) => {
    const [reviews, setReviews] = useState<BookReviewCardProps[]>([]);
    const [numReviews, setNumReviews] = useState<number>(0);

    useEffect(() => {
        ReviewService.getBookReviews(book.id)
            .then(reviewList => {
                setReviews(reviewList);
            })
            .catch(except => {
                console.log(except);
                setReviews([]);
            });
        setNumReviews(book.numreviews);
    }, [book]);

    // TODO: actualize reviews after submitting a review

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
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <h3 style={{
                        fontSize: '2rem',
                        color: '#4b5563',
                        marginBottom: '1rem',
                        flexGrow: 1
                    }}>
                        Reviews&ensp;-&ensp;
                        <span style={{ fontSize: '1.5rem' }}>
                            { numReviews } reviews
                        </span>
                    </h3>
                    <AddReviewButton author={book.author} title={book.title} bookId={book.id}/>
                </div>
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
