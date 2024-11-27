import endpoint from '../endpoints.config';
import axios from 'axios';

const SearchService = {
    bookRequest : async (query: string, max_num: number | null) => {
        const header = {'Content-Type': 'application/json'};
        return axios.get(
            endpoint.dbURL + '/books/search/' + query,
            {
                headers: header,
                params: { max_num } 
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

    userRequest : async (username: string, max_num: number | null) => {
        const header = {'Content-Type': 'application/json'};
        return axios.get(
            endpoint.dbURL + '/users/search',
            {
                headers: header,
                params: { username, max_num } 
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

export default SearchService;