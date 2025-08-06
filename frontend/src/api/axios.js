import axios from 'axios';

const BASE_URL = 'https://seat-wise-api.vercel.app/' || 'http://localhost:5500';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});