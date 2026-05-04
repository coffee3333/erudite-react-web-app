import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useForgotPassword from '../hooks/authHooks/useForgotPassword.jsx';

vi.mock('../api/endpoints/userService.jsx', () => ({
    default: {
        requestPasswordReset: vi.fn(),
        confirmPasswordReset: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import userService from '../api/endpoints/userService.jsx';
import toast from 'react-hot-toast';

describe('useForgotPassword', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial state is all false/idle', () => {
        const { result } = renderHook(() => useForgotPassword());
        expect(result.current.codeSent).toBe(false);
        expect(result.current.requesting).toBe(false);
        expect(result.current.confirming).toBe(false);
    });

    it('requestReset success sets codeSent true and shows toast', async () => {
        userService.requestPasswordReset.mockResolvedValue({});
        const { result } = renderHook(() => useForgotPassword());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.requestReset('user@test.com');
        });
        expect(result.current.codeSent).toBe(true);
        expect(returnVal).toBe(true);
        expect(toast.success).toHaveBeenCalled();
    });

    it('requestReset failure shows error toast and returns false', async () => {
        userService.requestPasswordReset.mockRejectedValue({ response: { data: { error: 'Not found' } } });
        const { result } = renderHook(() => useForgotPassword());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.requestReset('bad@email.com');
        });
        expect(returnVal).toBe(false);
        expect(result.current.codeSent).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Not found');
    });

    it('confirmReset success shows success toast and returns true', async () => {
        userService.confirmPasswordReset.mockResolvedValue({});
        const { result } = renderHook(() => useForgotPassword());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.confirmReset({ email: 'a@b.com', otp_code: '123456', new_password: 'newpass' });
        });
        expect(returnVal).toBe(true);
        expect(toast.success).toHaveBeenCalled();
    });

    it('confirmReset failure shows error toast and returns false', async () => {
        userService.confirmPasswordReset.mockRejectedValue({ response: { data: { error: 'Expired' } } });
        const { result } = renderHook(() => useForgotPassword());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.confirmReset({ email: 'a@b.com', otp_code: '000000', new_password: 'pass' });
        });
        expect(returnVal).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('Expired');
    });

    it('requesting is true while awaiting requestReset', async () => {
        let resolveReq;
        userService.requestPasswordReset.mockReturnValue(new Promise((res) => { resolveReq = res; }));
        const { result } = renderHook(() => useForgotPassword());
        act(() => { result.current.requestReset('a@b.com'); });
        expect(result.current.requesting).toBe(true);
        await act(async () => { resolveReq({}); });
    });
});
