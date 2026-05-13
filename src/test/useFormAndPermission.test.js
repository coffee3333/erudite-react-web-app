import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useFormError from '../hooks/formHooks/useFormError.jsx';
import useIsOwner from '../hooks/permissionHooks/useIsOwner.jsx';
import useIsAllowed from '../hooks/permissionHooks/useIsAllowed.jsx';

vi.mock('../stores/authStore.jsx', () => {
    let state = { user: null, isLoggedIn: false };
    const store = vi.fn((selector) => selector(state));
    store.__setState = (s) => { state = s; };
    return { default: store };
});

import useAuthStore from '../stores/authStore.jsx';

beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.__setState({ user: null, isLoggedIn: false });
});

describe('useFormError', () => {
    it('initial errors is empty object', () => {
        const { result } = renderHook(() => useFormError());
        expect(result.current.errors).toEqual({});
    });

    it('setFieldError sets a field', () => {
        const { result } = renderHook(() => useFormError());
        act(() => { result.current.setFieldError('email', 'Required'); });
        expect(result.current.errors.email).toBe('Required');
    });

    it('clearErrors resets to empty', () => {
        const { result } = renderHook(() => useFormError());
        act(() => { result.current.setFieldError('email', 'Required'); });
        act(() => { result.current.clearErrors(); });
        expect(result.current.errors).toEqual({});
    });

    it('setServerError maps server error object', () => {
        const { result } = renderHook(() => useFormError());
        act(() => { result.current.setServerError({ email: ['This email is taken.'] }); });
        expect(result.current.errors.email).toBe('This email is taken.');
    });

    it('setServerError with non-array value', () => {
        const { result } = renderHook(() => useFormError());
        act(() => { result.current.setServerError({ username: 'Too short.' }); });
        expect(result.current.errors.username).toBe('Too short.');
    });

    it('setServerError ignores null/non-object', () => {
        const { result } = renderHook(() => useFormError());
        act(() => { result.current.setServerError(null); });
        expect(result.current.errors).toEqual({});
    });
});

describe('useIsOwner', () => {
    it('returns false when not logged in', () => {
        useAuthStore.__setState({ user: null, isLoggedIn: false });
        const { result } = renderHook(() => useIsOwner({ owner: 'alice' }));
        expect(result.current).toBe(false);
    });

    it('returns false when user is not teacher', () => {
        useAuthStore.__setState({ user: { username: 'alice', role: 'student' }, isLoggedIn: true });
        const { result } = renderHook(() => useIsOwner({ owner: 'alice' }));
        expect(result.current).toBe(false);
    });

    it('returns false when teacher but different username', () => {
        useAuthStore.__setState({ user: { username: 'bob', role: 'teacher' }, isLoggedIn: true });
        const { result } = renderHook(() => useIsOwner({ owner: 'alice' }));
        expect(result.current).toBe(false);
    });

    it('returns true when teacher and username matches', () => {
        useAuthStore.__setState({ user: { username: 'alice', role: 'teacher' }, isLoggedIn: true });
        const { result } = renderHook(() => useIsOwner({ owner: 'alice' }));
        expect(result.current).toBe(true);
    });
});

describe('useIsAllowed', () => {
    it('returns false when not logged in', () => {
        useAuthStore.__setState({ user: null, isLoggedIn: false });
        const { result } = renderHook(() => useIsAllowed());
        expect(result.current).toBe(false);
    });

    it('returns false when student', () => {
        useAuthStore.__setState({ user: { role: 'student', email_verified: true }, isLoggedIn: true });
        const { result } = renderHook(() => useIsAllowed());
        expect(result.current).toBe(false);
    });

    it('returns false when teacher but email not verified', () => {
        useAuthStore.__setState({ user: { role: 'teacher', email_verified: false }, isLoggedIn: true });
        const { result } = renderHook(() => useIsAllowed());
        expect(result.current).toBe(false);
    });

    it('returns true when teacher and email verified', () => {
        useAuthStore.__setState({ user: { role: 'teacher', email_verified: true }, isLoggedIn: true });
        const { result } = renderHook(() => useIsAllowed());
        expect(result.current).toBe(true);
    });
});
