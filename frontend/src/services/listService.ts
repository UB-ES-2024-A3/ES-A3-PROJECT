import { UpdateListsInterface } from "@/components/add_to_lists";
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
            return res.data.reverse();
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    },
    getListsWithBook: async (book_id: string) => {
        const user_id = localStorage.getItem('userId');
        return axios.get(
            endpoint.dbURL + '/user/booklists',
            {
                params: {user_id: user_id, book_id: book_id}
            } 
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    },
    updateListsWithBook: async(book_id: string, updateList: UpdateListsInterface) => {
        const user_id = localStorage.getItem('userId');
        const header = {'Content-Type': 'application/json'};
        const data = {
            user_id: user_id,
            book_id: book_id,
            book_list: updateList
        };

        return axios.post(
            endpoint.dbURL + '/booklist/update',
            data,
            {headers: header}
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            console.log(except.response.data.detail);
        });
    },
    getBooksOfList: async (list_id: string) => {
        return axios.get(
            endpoint.dbURL + '/bookList/'+list_id+'/books'
        )
        .then (res => {
            return res.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    },
    getIsListFollowed: async (list_id: string) => {
        const user_id = localStorage.getItem('userId');
        return axios.get(
            endpoint.dbURL + '/list/is-following',
            {
                params: {user_id: user_id, list_id: list_id}
            }
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    },
    followList: async (list_id: string) => {
        const user_id = localStorage.getItem('userId');
        return axios.post(
            endpoint.dbURL + `/list/follow?user_id=${user_id}&list_id=${list_id}`
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    },
    unfollowList: async (list_id: string) => {
        const user_id = localStorage.getItem('userId');
        return axios.post(
            endpoint.dbURL + `/list/unfollow?user_id=${user_id}&list_id=${list_id}`
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            throw except.response.data.detail;
        });
    }
};
export default ListService;