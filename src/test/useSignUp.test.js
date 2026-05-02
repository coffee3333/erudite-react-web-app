import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useSignUp from '../hooks/authHooks/useSignUp.jsx';

vi.mock('../api/endpoints/authService.jsx', () => ({
    default: {
        registration: vi.fn(),
    },
}));

vi.mock('../stores/authStore.jsx', () => ({
    default: Object.assign(
        vi.fn(() => ({ error: null, isLoading: false })),
        { getState: vi.fn(() => ({ error: null, isLoading: false })) }
    ),
}));

import authService from '../api/endpoints/authService.jsx';

const validData = {
    email: 'user@test.com',
    username: 'testuser',
    password: 'password123',
    password2: 'password123',
    role: 'student',
};

describe('useSignUp', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('signUp calls authService.registration with correct form data', async () => {
        authService.registration.mockResolvedValue({});
        const { result } = renderHook(() => useSignUp());
        await act(async () => {
            await result.current.signUp(validData);
        });
        expect(authService.registration).toHaveBeenCalledOnce();
        const [{ registrationForm }] = authService.registration.mock.calls[0];
        expect(registrationForm.get('email')).toBe(validData.email);
        expect(registrationForm.get('username')).toBe(validData.username);
        expect(registrationForm.get('role')).toBe(validData.role);
    });

    it('signUp throws when passwords do not match', async () => {
        const { result } = renderHook(() => useSignUp());
        await expect(
            act(async () => result.current.signUp({ ...validData, password2: 'different' }))
        ).rejects.toThrow('Passwords do not match.');
    });

    it('signUp throws when required fields are missing', async () => {
        const { result } = renderHook(() => useSignUp());
        await expect(
            act(async () => result.current.signUp({ email: '', username: '', password: '', password2: '', role: '' }))
        ).rejects.toThrow('Please fill in all required fields.');
    });

    it('signUp rethrows service errors', async () => {
        const err = new Error('Network error');
        authService.registration.mockRejectedValue(err);
        const { result } = renderHook(() => useSignUp());
        await expect(
            act(async () => result.current.signUp(validData))
        ).rejects.toBe(err);
    });
});
