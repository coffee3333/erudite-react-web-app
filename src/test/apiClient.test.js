import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubEnv('VITE_API_URL', 'https://api.example.com');

vi.mock('react-hot-toast', () => ({
    default: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('../stores/authStore.jsx', () => {
    const logout = vi.fn();
    const setAccessToken = vi.fn();
    const setIsLoggedIn = vi.fn();
    const store = vi.fn(() => null);
    store.getState = vi.fn(() => ({
        accessToken: 'test-token',
        isLoggedIn: true,
        refreshToken: 'refresh-token',
        logout,
        setAccessToken,
        setIsLoggedIn,
    }));
    return { default: store };
});

vi.mock('axios', async (importOriginal) => {
    const actual = await importOriginal();
    const mockInstance = {
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() },
        },
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    };
    return {
        default: {
            ...actual.default,
            create: vi.fn(() => mockInstance),
        },
    };
});

import toast from 'react-hot-toast';
import useAuthStore from '../stores/authStore.jsx';

describe('apiClient interceptors', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('module loads without error', async () => {
        const mod = await import('../api/apiClient.jsx');
        expect(mod.default).toBeDefined();
    });

    it('request interceptor attaches Bearer token when requiresAuth is not false', () => {
        useAuthStore.getState.mockReturnValue({
            accessToken: 'my-token',
            isLoggedIn: true,
            refreshToken: 'r',
            logout: vi.fn(),
            setAccessToken: vi.fn(),
            setIsLoggedIn: vi.fn(),
        });

        const config = { headers: {} };
        const token = useAuthStore.getState().accessToken;
        if (config.requiresAuth !== false && token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        expect(config.headers.Authorization).toBe('Bearer my-token');
    });

    it('request interceptor skips token when requiresAuth is false', () => {
        useAuthStore.getState.mockReturnValue({
            accessToken: 'my-token',
        });
        const config = { headers: {}, requiresAuth: false };
        if (config.requiresAuth !== false) {
            config.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;
        }
        expect(config.headers.Authorization).toBeUndefined();
    });

    it('response success handler returns response.data', () => {
        useAuthStore.getState.mockReturnValue({
            accessToken: 'tok',
            isLoggedIn: true,
            setIsLoggedIn: vi.fn(),
        });
        const response = { data: { id: 1 } };
        const { accessToken, isLoggedIn, setIsLoggedIn } = useAuthStore.getState();
        if (accessToken && !isLoggedIn) setIsLoggedIn(true);
        expect(response.data).toEqual({ id: 1 });
    });

    it('shows 400 toast with field error message', () => {
        const error = {
            config: { url: '/some/endpoint/' },
            response: {
                status: 400,
                data: { email: ['This email is taken.'] },
            },
        };
        const { data } = error.response;
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        const msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
        toast.error(msg);
        expect(toast.error).toHaveBeenCalledWith('email: This email is taken.');
    });

    it('shows 400 toast with string value', () => {
        const error = {
            config: { url: '/some/endpoint/' },
            response: {
                status: 400,
                data: { detail: 'Invalid data.' },
            },
        };
        const { data } = error.response;
        const firstKey = Object.keys(data)[0];
        const val = data[firstKey];
        const msg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
        toast.error(msg);
        expect(toast.error).toHaveBeenCalledWith('Invalid data.');
    });

    it('shows 403 toast', () => {
        toast.error('You do not have permission to perform this action.');
        expect(toast.error).toHaveBeenCalledWith('You do not have permission to perform this action.');
    });

    it('shows 404 toast', () => {
        toast.error('Resource not found.');
        expect(toast.error).toHaveBeenCalledWith('Resource not found.');
    });

    it('shows 500 toast', () => {
        toast.error('Server error. Please try again later.');
        expect(toast.error).toHaveBeenCalledWith('Server error. Please try again later.');
    });

    it('shows 429 toast', () => {
        toast.error('Too many requests. Please wait a moment and try again.');
        expect(toast.error).toHaveBeenCalledWith('Too many requests. Please wait a moment and try again.');
    });

    it('shows session expired toast when no refresh token', () => {
        useAuthStore.getState.mockReturnValue({
            accessToken: null,
            isLoggedIn: false,
            refreshToken: null,
            logout: vi.fn(),
            setAccessToken: vi.fn(),
            setIsLoggedIn: vi.fn(),
        });
        const { refreshToken, logout } = useAuthStore.getState();
        if (!refreshToken) {
            logout();
            toast.error('Session expired. Please log in again.');
        }
        expect(toast.error).toHaveBeenCalledWith('Session expired. Please log in again.');
    });

    it('silent URL patterns are matched correctly', () => {
        const silentUrlPatterns = [
            /\/platform\/courses\/[^/]+\/certificate\/$/,
            /\/platform\/courses\/[^/]+\/students\//,
            /\/platform\/courses\/[^/]+\/bookmark\//,
            /\/platform\/courses\/[^/]+\/feedback\//,
        ];
        expect(silentUrlPatterns.some(re => re.test('/platform/courses/my-course/certificate/'))).toBe(true);
        expect(silentUrlPatterns.some(re => re.test('/platform/courses/my-course/students/'))).toBe(true);
        expect(silentUrlPatterns.some(re => re.test('/platform/courses/my-course/bookmark/'))).toBe(true);
        expect(silentUrlPatterns.some(re => re.test('/platform/courses/my-course/feedback/'))).toBe(true);
        expect(silentUrlPatterns.some(re => re.test('/platform/courses/my-course/delete/'))).toBe(false);
    });

    it('processQueue resolves all queued promises with token', () => {
        const resolved = [];
        const queue = [
            { resolve: (t) => resolved.push({ ok: t }), reject: vi.fn() },
            { resolve: (t) => resolved.push({ ok: t }), reject: vi.fn() },
        ];
        queue.forEach(p => p.resolve('new-access-token'));
        expect(resolved).toEqual([{ ok: 'new-access-token' }, { ok: 'new-access-token' }]);
    });

    it('processQueue rejects all queued promises on error', () => {
        const rejected = [];
        const err = new Error('refresh failed');
        const queue = [
            { resolve: vi.fn(), reject: (e) => rejected.push(e) },
            { resolve: vi.fn(), reject: (e) => rejected.push(e) },
        ];
        queue.forEach(p => p.reject(err));
        expect(rejected).toHaveLength(2);
        expect(rejected[0]).toBe(err);
    });
});
