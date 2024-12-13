import endpoint from "@/endpoints.config";
import axios from 'axios';

const ListService = {
    createListRequest: async (listName: string) => {
        const userId = localStorage.getItem('userId');

        const data = {
            name: listName,
            user_id: userId,
        };

        const header = {'Content-Type': 'application/json'};

        return axios.post(
            endpoint.dbURL + '/bookList',
            data,
            {headers: header}
        )
        .then(userResult => {
            return userResult.data;
        })
        .catch(except => {
            if (except.status == 500) {
                throw except.response.data.detail;
            } else {
                console.log(except);
                throw "Unknown error. Please, try again.";
            }
        });
    },
    getUserLists: async (user_id: string) => {
        return axios.get(
            endpoint.dbURL + '/bookList/' + user_id
        )
        .then(res => {
            return res.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    }
};
export default ListService;