import endpoint from "@/endpoints.config";
import axios from 'axios';

interface ReviewData {
    username: string,
    rating: number,
    review?: string,
    date?: string,
    time?: string
}

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
    },
    getBookReviews : async (bookId: string) => {
        // TODO: AXIOS request
        const mockReviews = [
            {
                username: "avid.reader",
                rating: 5,
                date: '11/02/2022',
                time: '13:30:28',
                review: 'This book is enticing. Raggh... woof... grrr... I like so very much'
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
        return new Promise<Array<ReviewData>>(resolve => { return resolve(mockReviews); });
    }
};

export default ReviewService;
