import endpoint from '../endpoints.config';
import axios from 'axios';

const LoginService = {
    loginRequest : async (user: string, password: string) => {
        const data = {
            credentials: user,
            password: password
        }

        const header = {'Content-Type': 'application/json'};

        return axios.post(
            endpoint.dbURL + '/login',
            data,
            {headers: header}
        )
        .then(() => {
            return 'OK';
        })
        .catch((except) => {
            const detailRaw = except.response.data.detail;      // Returns "500: {'credentials': 'message'}"
            if (detailRaw.includes('{')) {                      // Make sure it has the above format
                const bracesIdx = detailRaw.indexOf('{');       // Find where the "object" starts
                const detail = detailRaw.substring(bracesIdx)   // Ignore the beginning
                                        .replaceAll("'", '"');  // and give the string JSON format

                let errorObject = null;
                try {
                    errorObject = JSON.parse(detail);           // Parse the JSON object
                } catch {}

                if (errorObject) {
                    throw errorObject;                          // Throw the resulting object
                }
            }

            console.log(detailRaw);
            throw {credentials: "Unknown error. Please try again."}; // If the response doesn't have the above format.
        });
    }
}

export default LoginService;