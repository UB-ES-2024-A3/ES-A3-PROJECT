import endpoint from "@/endpoints.config";
import axios from 'axios';

const ReviewService = {
    createReviewRequest: async (rating: number, review: string, bookId: string) => {
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0];
        const userId = localStorage.getItem('userId');

        const data = {
            comment: review,
            stars: rating,
            date: date,
            time: time,
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
            return userResult.data.id;
        })
        .catch(except => {
            if (except.status == 400) {
                throw except.response.data.detail;
            } else {
                console.log(except);
                throw "Unknown error. Please, try again.";
            }
        });
    }
};

export default ReviewService;
