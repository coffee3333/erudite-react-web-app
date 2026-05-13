import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore';
import errorHandler from '../utils/errorHandler.jsx';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Accept': 'application/json' },
    withCredentials: false,
});

// Bare axios instance used only for token refresh — bypasses our interceptors
// so a failed refresh doesn't loop back into this error handler.
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Accept': 'application/json' },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
    failedQueue = [];
};

// ── Request interceptor — attach Bearer token ─────────────────────────────────
apiClient.interceptors.request.use(
    (config) => {
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

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
    (response) => {
        // Keep isLoggedIn in sync
        const { accessToken, isLoggedIn, setIsLoggedIn } = useAuthStore.getState();
        if (accessToken && !isLoggedIn) setIsLoggedIn(true);
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // ── 1. Let custom per-URL handlers run first (registration, login, etc.)
        //       If they return true they already showed a toast — skip everything else.
        const customHandler = errorHandler[originalRequest?.url];
        if (customHandler && customHandler(error)) {
            return Promise.reject(error);
        }

        // ── 2. For 401s that aren't the login endpoint, attempt a token refresh
        //       before showing any error toast.
        const isLoginUrl = originalRequest?.url?.includes('/users/auth/login/');
        const isRefreshUrl = originalRequest?.url?.includes('/users/token/refresh/');

        if (status === 401 && !isLoginUrl && !isRefreshUrl && !originalRequest._retry) {
            // If another refresh is already in flight, queue this request
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

            const { refreshToken, logout, setAccessToken, setIsLoggedIn } = useAuthStore.getState();

            if (!refreshToken) {
                isRefreshing = false;
                logout();
                toast.error('Session expired. Please log in again.');
                return Promise.reject(error);
            }

            try {
                const res = await refreshClient.post('/users/token/refresh/', { refresh: refreshToken });
                const { access } = res.data;

                setAccessToken(access);
                localStorage.setItem('authToken', access);
                setIsLoggedIn(true);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                processQueue(null, access);
                return apiClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                logout();
                toast.error('Session expired. Please log in again.');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // ── 3. Skip toast for endpoints that handle errors silently in the hook
        const silentUrlPatterns = [
            /\/platform\/courses\/[^/]+\/certificate\/$/,
            /\/platform\/courses\/[^/]+\/students\//,
            /\/platform\/courses\/[^/]+\/bookmark\//,
            /\/platform\/courses\/[^/]+\/feedback\//,
        ];
        if (silentUrlPatterns.some(re => re.test(originalRequest?.url))) {
            return Promise.reject(error);
        }

        // ── 4. Show a single toast for all other HTTP errors (non-silent endpoints)
        if (error.response) {
            const { data } = error.response;

            switch (status) {
                case 400: {
                    let msg = 'Bad request.';
                    if (data && typeof data === 'object') {
                        const firstKey = Object.keys(data)[0];
                        if (firstKey) {
                            const val = data[firstKey];
                            msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
                        }
                    }
                    toast.error(msg);
                    break;
                }
                case 401:
                    // Only reaches here for login endpoint (handled above for others)
                    toast.error('Invalid email or password.');
                    break;
                case 403:
                    toast.error('You do not have permission to perform this action.');
                    break;
                case 404:
                    toast.error('Resource not found.');
                    break;
                case 429:
                    toast.error('Too many requests. Please wait a moment and try again.');
                    break;
                case 500:
                    toast.error('Server error. Please try again later.');
                    break;
                default:
                    toast.error(data?.detail || data?.message || 'An unknown error occurred.');
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
