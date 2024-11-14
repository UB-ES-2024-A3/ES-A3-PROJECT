import endpoint from "@/endpoints.config";
import axios from 'axios';

const RegisterService = {
    registerRequest: async (username: string, email: string, password: string) => {
        const data = {
            username: username,
            password: password,
            email: email
        };

        const header = {'Content-Type': 'application/json'};

        // Send post request to backend
        return axios.post(
            endpoint.dbURL + '/users',
            data,
            {headers: header}
        )
        .then(userResult => {
            return userResult.data.id;
        })
        .catch(except => {
            if (except.status == 400) {
                // Error in entered data.
                throw except.response.data.detail;
            } else {
                console.log(except);
                throw "Unknown error. Please, try again.";
            }
        });
    }
};

export default RegisterService;
