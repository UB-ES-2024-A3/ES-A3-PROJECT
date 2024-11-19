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
            return response.data;
        })
        .catch(except => {
            throw except.detail;
        });
    }
};

export default ReviewService;
