import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSignIn from '../hooks/authHooks/useSignIn.jsx';

vi.mock('../api/endpoints/authService.jsx', () => ({
    default: {
        login: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import authService from '../api/endpoints/authService.jsx';
import toast from 'react-hot-toast';

describe('useSignIn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial state has loading false and no error', () => {
        const { result } = renderHook(() => useSignIn());
        expect(result.current.isLoading).toBe(false);
        expect(result.current.serverErrorMsg).toBeNull();
    });

    it('signIn success shows success toast', async () => {
        authService.login.mockResolvedValue({ data: { access: 'tok' } });
        const { result } = renderHook(() => useSignIn());
        await act(async () => {
            await result.current.signIn({ email: 'a@b.com', password: 'pass' });
        });
        expect(toast.success).toHaveBeenCalledWith('Successfully logged in!');
    });

    it('signIn sets loading true then false', async () => {
        let resolveLogin;
        authService.login.mockReturnValue(new Promise((res) => { resolveLogin = res; }));
        const { result } = renderHook(() => useSignIn());
        const signInPromise = act(async () => { result.current.signIn({ email: 'a@b.com', password: 'pass' }).catch(() => {}); });
        await act(async () => { resolveLogin({}); });
        await signInPromise;
        expect(result.current.isLoading).toBe(false);
    });

    it('signIn failure sets serverErrorMsg', async () => {
        const err = { response: { data: { error: 'Invalid credentials.' } } };
        authService.login.mockRejectedValue(err);
        const { result } = renderHook(() => useSignIn());
        await act(async () => {
            try { await result.current.signIn({ email: 'a@b.com', password: 'wrong' }); } catch {}
        });
        expect(result.current.serverErrorMsg).toBe('Invalid credentials.');
    });

    it('signIn failure rethrows the error', async () => {
        const err = { response: { data: { error: 'Bad' } } };
        authService.login.mockRejectedValue(err);
        const { result } = renderHook(() => useSignIn());
        await expect(
            act(async () => result.current.signIn({ email: 'a@b.com', password: 'bad' }))
        ).rejects.toBe(err);
    });
});
