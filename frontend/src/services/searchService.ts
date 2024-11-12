import endpoint from '../endpoints.config';
import axios from 'axios';

const SearchService = {
    searchRequest : async (query: string, max_num: any) => {
        const header = {'Content-Type': 'application/json'};
        return axios.get(
            endpoint.dbURL + '/books/search/' + query,
            {headers: header}
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