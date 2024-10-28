import endpoint from '../endpoints.config';
import axios from 'axios';

const mockCallback = async (data: {username: string, password: string}) => {
    // Mock login data
    const mockUser = "testUser";
    const mockEmail = "testUser@local.host";
    const password = "testPass";
    if ((data.username === mockUser || data.username === mockEmail) && data.password === password)
        return null;
    else
        return {statusCode: 500, detail: "Wrong Email/Username"};
}

const LoginService = {
    loginRequest : async (user: string, password: string) => {
        return mockCallback(
            {username: user, password: password}
        )
        .then((res) => {
            if (res) {
                return res.detail;
            }
            return 'OK';
        });
    
        /* Axios call 2 backend
        return axios.post(
                endpoint.dbURL + '/login',
                {username: user, password: password}
            )
            .then(() => {
                return 'OK';
            })
            .catch((e) => {
                return e.detail;
            });
        */
    }
}

export default LoginService;