import endpoint from "@/endpoints.config";
import axios from 'axios';

const FollowersService = {
    followUser : async (selfUserId: string, otherUserId: string) => {
        return axios.post(
            endpoint.dbURL + '/users/follow/' + selfUserId + "/" + otherUserId
        )
        .then(response => {
            const succeed = response.status == 200
            return succeed;
        })
        .catch(except => {
            throw except;
        });
    },
    isFollower : async (selfUserId: string, otherUserId: string) => {
        return axios.get(
            endpoint.dbURL + '/users/follow/' + selfUserId + "/" + otherUserId
        )
        .then(response => {
            return response.data;
        })
        .catch(except => {
            throw except;
        });
    },
    
};

export default FollowersService;
