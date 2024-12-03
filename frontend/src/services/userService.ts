import endpoint from "@/endpoints.config";
import axios from 'axios';

const UserService = {
    getUser: async (userId: string) => {
        return axios.get(
            endpoint.dbURL + "/users/username/id/" + userId,
        )
        .then(userResult => {
            return userResult.data;
        })
        .catch(except => {
            throw except.detail;
        });
    }
};

export default UserService;
