import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useEmailVerification from '../hooks/userHooks/useEmailVerification.jsx';

vi.mock('../api/endpoints/userService.jsx', () => ({
    default: {
        requestEmailVerification: vi.fn(),
        confirmEmailVerification: vi.fn(),
    },
}));

vi.mock('../api/apiClient.jsx', () => ({
    default: {
        get: vi.fn(),
    },
}));

vi.mock('../stores/authStore.jsx', () => {
    const setUser = vi.fn();
    const store = vi.fn(() => setUser);
    store.getState = vi.fn(() => ({ setUser }));
    return { default: store };
});

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import userService from '../api/endpoints/userService.jsx';
import apiClient from '../api/apiClient.jsx';
import toast from 'react-hot-toast';

describe('useEmailVerification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial state is all false', () => {
        const { result } = renderHook(() => useEmailVerification());
        expect(result.current.codeSent).toBe(false);
        expect(result.current.requesting).toBe(false);
        expect(result.current.confirming).toBe(false);
    });

    it('requestCode success sets codeSent true and shows toast', async () => {
        userService.requestEmailVerification.mockResolvedValue({});
        const { result } = renderHook(() => useEmailVerification());
        await act(async () => {
            await result.current.requestCode();
        });
        expect(result.current.codeSent).toBe(true);
        expect(toast.success).toHaveBeenCalled();
    });

    it('requestCode failure shows error toast', async () => {
        userService.requestEmailVerification.mockRejectedValue({ response: { data: { error: 'Already verified' } } });
        const { result } = renderHook(() => useEmailVerification());
        await act(async () => {
            await result.current.requestCode();
        });
        expect(result.current.codeSent).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Already verified');
    });

    it('confirmCode success calls apiClient.get and returns true', async () => {
        userService.confirmEmailVerification.mockResolvedValue({});
        apiClient.get.mockResolvedValue({ id: 1, email_verified: true });
        const { result } = renderHook(() => useEmailVerification());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.confirmCode('123456');
        });
        expect(returnVal).toBe(true);
        expect(apiClient.get).toHaveBeenCalledWith('/users/profile/me/');
        expect(toast.success).toHaveBeenCalled();
    });

    it('confirmCode failure shows error toast and returns false', async () => {
        userService.confirmEmailVerification.mockRejectedValue({ response: { data: { error: 'Invalid code' } } });
        const { result } = renderHook(() => useEmailVerification());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.confirmCode('000000');
        });
        expect(returnVal).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Invalid code');
    });
});
