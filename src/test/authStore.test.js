import { describe, it, expect, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value; },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import useAuthStore from '../stores/authStore';

describe('authStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useAuthStore.setState({
            user: null,
            isLoggedIn: false,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
        });
    });

    it('initial state has no user', () => {
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isLoggedIn).toBe(false);
        expect(state.accessToken).toBeNull();
    });

    it('setAccessToken sets token and isLoggedIn to true', () => {
        useAuthStore.getState().setAccessToken('abc123');
        const state = useAuthStore.getState();
        expect(state.accessToken).toBe('abc123');
        expect(state.isLoggedIn).toBe(true);
        expect(localStorage.getItem('authToken')).toBe('abc123');
    });

    it('setAccessToken with null sets isLoggedIn to false', () => {
        useAuthStore.getState().setAccessToken('abc123');
        useAuthStore.getState().setAccessToken(null);
        const state = useAuthStore.getState();
        expect(state.accessToken).toBeNull();
        expect(state.isLoggedIn).toBe(false);
        expect(localStorage.getItem('authToken')).toBeNull();
    });

    it('setRefreshToken stores token in localStorage', () => {
        useAuthStore.getState().setRefreshToken('refresh123');
        expect(localStorage.getItem('refreshToken')).toBe('refresh123');
        expect(useAuthStore.getState().refreshToken).toBe('refresh123');
    });

    it('setUser stores user in localStorage', () => {
        const user = { id: 1, username: 'testuser' };
        useAuthStore.getState().setUser(user);
        expect(useAuthStore.getState().user).toEqual(user);
        expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
    });

    it('logout clears all auth state', () => {
        useAuthStore.getState().setAccessToken('abc123');
        useAuthStore.getState().setRefreshToken('refresh123');
        useAuthStore.getState().setUser({ id: 1, username: 'testuser' });

        useAuthStore.getState().logout();

        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isLoggedIn).toBe(false);
        expect(state.accessToken).toBeNull();
        expect(state.refreshToken).toBeNull();
        expect(localStorage.getItem('authToken')).toBeNull();
        expect(localStorage.getItem('refreshToken')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });

    it('setIsLoading updates loading state', () => {
        useAuthStore.getState().setIsLoading(true);
        expect(useAuthStore.getState().isLoading).toBe(true);
        useAuthStore.getState().setIsLoading(false);
        expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('setError updates error state', () => {
        useAuthStore.getState().setError('Something went wrong');
        expect(useAuthStore.getState().error).toBe('Something went wrong');
    });
});
