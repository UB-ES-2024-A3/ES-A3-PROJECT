import endpoint from '../endpoints.config';
import axios from 'axios';

const login_request = async (user: string, password: string) => {
    return axios.post(
            endpoint.dbURL + '/login',
            {username: user, password: password}
        )
        .then(() => { return 'OK'; })
        .catch((e) => { return e.detail; })
}

export default login_request;