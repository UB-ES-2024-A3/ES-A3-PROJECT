import endpoint from '../endpoints.config';
import axios from 'axios';

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
    }
}

export default ShowBookService;