import endpoint from '../endpoints.config';
import axios from 'axios';

interface ReviewData {
    username: string,
    rating: number,
    review?: string,
    date?: string,
    time?: string
}

const ShowBookService = {
    getBookRequest : async (bookId: string) => {
        const header = {'Content-Type': 'application/json'};
        return axios.get(
            endpoint.dbURL + '/books/' + bookId,
            {
                headers: header
            }
        )
        .then((response) => {
            return response.data;
        })
        .catch((except) => {
            const detailRaw = except.response?.data?.detail || "An unknown error occurred."; 
            throw detailRaw;
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

}

export default ShowBookService;