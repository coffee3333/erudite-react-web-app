import apiClient from '../apiClient';
import useAuthStore from "../../stores/authStore.jsx";
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
            const response = await apiClient.post('/users/auth/google/', { access_token }, {
                requiresAuth: false,
            });

            const { access, refresh } = response;

            store.setAccessToken(access);
            store.setRefreshToken(refresh);

            const userResponse = await apiClient.get('/users/profile/me/');
            store.setUser(userResponse);
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

    logout: async () => {
        const store = useAuthStore.getState();
        const refresh = store.refreshToken;
        try {
            if (refresh) {
                await apiClient.post('/users/auth/logout/', { refresh });
            }
        } catch (_) {
            // token already expired or invalid — proceed with local cleanup
        } finally {
            store.logout();
        }
    },
};

export default authService;