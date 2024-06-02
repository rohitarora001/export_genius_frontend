import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Router from 'next/router';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            // Redirect to login page if the user is not authenticated
            Router.push('/auth/signout');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
