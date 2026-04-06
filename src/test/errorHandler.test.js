import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../utils/errorHandler';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
    default: {
        error: vi.fn(),
        success: vi.fn(),
    },
}));

import toast from 'react-hot-toast';

describe('errorHandler', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('/users/auth/registration/', () => {
        const handler = errorHandler['/users/auth/registration/'];

        it('shows email error on 400 with email field', () => {
            const error = { response: { status: 400, data: { email: ['This email is already taken.'] } } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Email:'));
        });

        it('shows username error on 400 with username field', () => {
            const error = { response: { status: 400, data: { username: ['Username too short.'] } } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Username:'));
        });

        it('shows password error on 400 with password field', () => {
            const error = { response: { status: 400, data: { password: ['Password too weak.'] } } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('Password:'));
        });

        it('shows generic message when no known fields', () => {
            const error = { response: { status: 400, data: {} } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith('Registration failed. Please check your input.');
        });

        it('returns false for non-400 status', () => {
            const error = { response: { status: 500, data: {} } };
            const result = handler(error);
            expect(result).toBe(false);
            expect(toast.error).not.toHaveBeenCalled();
        });

        it('shows non_field_errors when present', () => {
            const error = { response: { status: 400, data: { non_field_errors: ['Passwords do not match.'] } } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith('Passwords do not match.');
        });
    });

    describe('/users/auth/login/', () => {
        const handler = errorHandler['/users/auth/login/'];

        it('shows invalid credentials on 400', () => {
            const error = { response: { status: 400, data: {} } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith('Invalid email or password.');
        });

        it('returns false for non-400 status', () => {
            const error = { response: { status: 401, data: {} } };
            const result = handler(error);
            expect(result).toBe(false);
        });
    });

    describe('/users/users/me/update/', () => {
        const handler = errorHandler['/users/users/me/update/'];

        it('shows username error on 400', () => {
            const error = { response: { status: 400, data: { username: 'Username already taken.' } } };
            const result = handler(error);
            expect(result).toBe(true);
            expect(toast.error).toHaveBeenCalledWith('Username already taken.');
        });

        it('returns false for non-400 status', () => {
            const error = { response: { status: 500, data: {} } };
            const result = handler(error);
            expect(result).toBe(false);
        });
    });

    describe('/users/auth/password/reset/request/', () => {
        const handler = errorHandler['/users/auth/password/reset/request/'];

        it('returns true on 404', () => {
            const error = { response: { status: 404, data: {} } };
            const result = handler(error);
            expect(result).toBe(true);
        });

        it('returns false for non-404 status', () => {
            const error = { response: { status: 500, data: {} } };
            const result = handler(error);
            expect(result).toBe(false);
        });
    });

    describe('/users/auth/password/reset/confirm/', () => {
        const handler = errorHandler['/users/auth/password/reset/confirm/'];

        it('returns true on 400', () => {
            const error = { response: { status: 400, data: {} } };
            const result = handler(error);
            expect(result).toBe(true);
        });

        it('returns false for non-400 status', () => {
            const error = { response: { status: 500, data: {} } };
            const result = handler(error);
            expect(result).toBe(false);
        });
    });
});
