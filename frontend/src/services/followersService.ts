import endpoint from "@/endpoints.config";
import axios from 'axios';

const FollowersService = {
    followUser : async (selfUserId: string, otherUserId: string) => {
        return axios.post(
            endpoint.dbURL + '/users/follow/' + selfUserId + "/" + otherUserId
        )
        .then(response => {
            console.log(response)
            const succeed = response.status == 200
            return succeed;
        })
        .catch(except => {
            throw except;
        });
    },
    
};

export default FollowersService;
