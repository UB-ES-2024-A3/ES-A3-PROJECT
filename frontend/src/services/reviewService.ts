import endpoint from "@/endpoints.config";
import axios from 'axios';

const ReviewService = {
    createReviewRequest: async (rating: number, review: string, bookId: string) => {
        const userId = localStorage.getItem('userId');

        const data = {
            comment: review,
            stars: rating,
            book_id: bookId,
            user_id: userId,
        };

        const header = {'Content-Type': 'application/json'};

        return axios.post(
            endpoint.dbURL + '/make_review',
            data,
            {headers: header}
        )
        .then(userResult => {
            return userResult.data;
        })
        .catch(except => {
            if (except.status == 400) {
                throw except.response.data.detail;
            } else {
                console.log(except);
                throw "Unknown error. Please, try again.";
            }
        });
    },
    getBookReviews : async (bookId: string) => {
        return axios.get(
            endpoint.dbURL + '/reviews/book/' + bookId,
        )
        .then(response => {
            // Fetch username from received data.
            const reviews = response.data.map((review: { users: { username: string, id: string }, time: string}) => {
                return {...review, username: review.users.username, time: review.time.slice(0, 8), userId: review.users.id};
            })
            return reviews;
        })
        .catch(except => {
            throw except.detail;
        });
    },
    getUserReviews : async (userId: string) => {
        return axios.get(
            endpoint.dbURL + '/reviews/user/' + userId,
        )
        .then(response => {
            // Fetch author and title from received data.
            const reviews = response.data.map((review: { books: { author: string, title: string}, time: string }) => {
                return {...review, author: review.books.author, title: review.books.title,  time: review.time ? review.time.slice(0, 8) : ""};
            })
            return reviews;
        })
        .catch(except => {
            throw except.detail;
        });
    }
};

export default ReviewService;
