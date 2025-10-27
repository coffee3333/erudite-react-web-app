import apiClient from '../apiClient';
import useAuthStore from '../../stores/authStore';
import toast from "react-hot-toast";

const authService = {
    login: async (credentials) => {
        const store = useAuthStore.getState();
        store.setIsLoading(true);
        store.setError(null);

        try {
            const response = await apiClient.post('/users/auth/login/', credentials);
            const { access, refresh } = response;

            store.setAccessToken(access);
            store.setRefreshToken(refresh);

            const userResponse = await apiClient.get('/users/profile/me/');
            console.log(userResponse.role);
            store.setUser(userResponse);
            store.setIsLoggedIn(true);
        } catch (err) {
            store.setError(err.message || 'Login failed');
            throw err;
        } finally {
            store.setIsLoading(false);
        }
    },

    loginWithGoogle: async (access_token) => {
        const store = useAuthStore.getState();
        store.setIsLoading(true);
        store.setError(null);

        try {
            const response = await apiClient.post('/users/auth/google/', {
                access_token,
            }, { withCredentials: true }, {
                requiresAuth: false,
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const { access, refresh } = response;

            store.setAccessToken(access);
            store.setRefreshToken(refresh);

            const userResponse = await apiClient.get('/users/profile/me/',);
            store.setUser(userResponse); // <= если userResponse = данные
            store.setIsLoggedIn(true);
        } catch (err) {
            store.setError(err.message || 'Google login failed');
            throw err;
        } finally {
            store.setIsLoading(false);
        }
    },

    registration: async ({ registrationForm }) => {
        const store = useAuthStore.getState();
        store.setIsLoading(true);
        store.setError(null);

        console.log(registrationForm.get("email"));
        console.log(registrationForm.get("username"));
        console.log(registrationForm.get("password"));
        console.log(registrationForm.get("role"));

        try {
            await apiClient.post('/users/auth/registration/', registrationForm,  {
                requiresAuth: false,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success('Registration successful!');
        } catch (err) {
            store.setError(err.message || 'Registration failed');
            throw err;
        } finally {
            store.setIsLoading(false);
        }
    },

    logout: () => {
        useAuthStore.getState().logout();
    },
};

export default authService;