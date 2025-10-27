import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import errorHandler from '../utils/errorHandler.jsx';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
    },
    withCredentials: false,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use(
    async (config) => {
        if (config.requiresAuth !== false) {
            const token = useAuthStore.getState().accessToken;
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => {
        const token = useAuthStore.getState().accessToken;
        if (token && !useAuthStore.getState().isLoggedIn) {
            useAuthStore.getState().setIsLoggedIn(true);
        }
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        const { setIsLoggedIn, logout } = useAuthStore.getState();

        const customHandler = errorHandler[originalRequest.url];
        if (customHandler && customHandler(error)) {
            return Promise.reject(error); // Передаем ошибку дальше, если она обработана
        }

        if (error.response) {
            const { status, data } = error.response;
            const errorMessage = data?.detail || data?.message || 'An unknown error occurred.';

            switch (status) {
                case 400:
                    toast.error('Bad request.');
                    break;
                case 401:
                    if (originalRequest.url.includes('/users/auth/login/')) {
                        toast.error('Invalid email or password.');
                    } else {
                        console.log(useAuthStore.getState().accessToken);
                        toast.error('Session expired. Please log in again.');
                    }
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error('Resource not found.');
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    toast.error(errorMessage);
            }
        }

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/users/auth/login/')) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const { refreshToken } = useAuthStore.getState();
            if (!refreshToken) {
                logout();
                return Promise.reject(error);
            }

            try {
                const response = await apiClient.post('/users/token/refresh/', { refresh: refreshToken });
                const { access } = response;

                useAuthStore.getState().setAccessToken(access);
                localStorage.setItem('authToken', access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                processQueue(null, access);

                setIsLoggedIn(true);

                return apiClient(originalRequest);
            } catch (refreshError) {
                logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status === 401 && !originalRequest.url.includes('/users/auth/login/')) {
            logout();
        }

        return Promise.reject(error);
    }
);

export default apiClient;