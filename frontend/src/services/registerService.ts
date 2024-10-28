import endpoint from "@/endpoints.config";
import axios from 'axios';

const RegisterService = {
    registerRequest: async (username: string, email: string, password: string) => {
        const data = {
            username: username,
            email: email,
            password: password
        };
        
        // Send post request to backend
        return axios.post(
            endpoint.dbURL + '/users',
            data
        )
        .then(result => {
            return "Success!";
        })
        .catch(except => {
            if (except.status_code === 400) {
                // Error in entered data.
                return except.detail;
            } else {
                console.error(except.detail);
                return "Unknown error. Please, try again.";
            }
        });
    }
};

export default RegisterService;
