import React from "react";
import { useState, useEffect } from "react";
import { Book } from "@/pages/timeline";
import BookReviewCard from "./book_review_card";
import { BookReviewCardProps } from "./book_review_card";
import AddReviewButton, { ReviewResponseData } from "./add_review";
import ReviewService from "@/services/reviewService";

interface BookReviewSectionFields {
    book: Book
}

const BookReviewSection: React.FC<BookReviewSectionFields> = ({ book }) => {
    const [reviews, setReviews] = useState<BookReviewCardProps[]>([]);
    const [numReviews, setNumReviews] = useState<number>(0);
    const [newReview, setNewReview] = useState<BookReviewCardProps>({username: '', stars: 0, date: '', time: '', comment: ''});

    function addReviewCallback(newReview: ReviewResponseData) {
        setNewReview({
            username: 'me',
            stars: newReview.stars,
            date: newReview.date,
            time: newReview.time,
            comment: newReview.comment
        });
    }

    useEffect(() => {
        ReviewService.getBookReviews(book.id)
            .then(reviewList => {
                console.log(reviewList)
                setReviews(reviewList);
            })
            .catch(except => {
                console.log(except);
                setReviews([]);
            });
        setNumReviews(book.numreviews);
    }, [book]);

    // Actualize reviews after submitting a review
    useEffect(() => {
        reviews.splice(0, 0, newReview);
        setNumReviews(numReviews + 1);
    }, [newReview]);

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
                    <AddReviewButton author={book.author} title={book.title} bookId={book.id} callback={addReviewCallback}/>
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
                                username={review.username || 'username'}
                                stars={review.stars}
                                comment={review.comment}
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
