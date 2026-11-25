
import axios from 'axios';

const api = axios.create({baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        const isAuthRequest = error.config?.url?.includes('/auth/');

        if (isUnauthorized && !isAuthRequest) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            localStorage.removeItem('name');
        }

        return Promise.reject(error);
    }
);

export function errMsg(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Something went wrong. Please try again.';
}

export default api;
