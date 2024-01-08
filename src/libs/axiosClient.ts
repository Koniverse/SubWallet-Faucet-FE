import axios from 'axios';

console.log(process.env);
console.log(process.env.REACT_APP_API_URL);

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'content-type': 'application/json',
    }
});
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }

        return response;
    },
    (error) => {
        console.log(error);
        throw error;
    }
);

export default axiosClient;
