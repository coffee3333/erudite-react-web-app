import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: !!localStorage.getItem('authToken'),
    isLoading: false,
    error: null,
    accessToken: localStorage.getItem('authToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    setAccessToken: (accessToken) => {
        if (accessToken) {
            localStorage.setItem('authToken', accessToken);
        } else {
            localStorage.removeItem('authToken');
        }
        set({ accessToken, isLoggedIn: !!accessToken });
    },
    setRefreshToken: (refreshToken) => {
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
        set({ refreshToken });
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        set({ user: null, isLoggedIn: false, accessToken: null, refreshToken: null });
    },
}));

export default useAuthStore;