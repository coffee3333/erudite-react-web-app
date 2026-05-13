import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLeaderboard from '../hooks/userHooks/useLeaderboard.jsx';
import useGetDashboard from '../hooks/userHooks/useGetDashboard.jsx';
import useGetTeacherDashboard from '../hooks/userHooks/useGetTeacherDashboard.jsx';
import useUpdateProfile from '../hooks/userHooks/useUpdateProfile.jsx';

vi.mock('../api/endpoints/userService.jsx', () => ({
    default: {
        getLeaderboard: vi.fn(),
        getDashboard: vi.fn(),
        getTeacherDashboard: vi.fn(),
        updateProfile: vi.fn(),
    },
}));

vi.mock('../stores/authStore.jsx', () => {
    const setUser = vi.fn();
    const store = vi.fn(() => null);
    store.getState = vi.fn(() => ({ user: { username: 'alice' }, setUser }));
    return { default: store };
});

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import userService from '../api/endpoints/userService.jsx';
import toast from 'react-hot-toast';

beforeEach(() => vi.clearAllMocks());

describe('useLeaderboard', () => {
    it('initial state', () => {
        const { result } = renderHook(() => useLeaderboard());
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    it('success sets data', async () => {
        userService.getLeaderboard.mockResolvedValue({ leaderboard: [{ username: 'alice' }] });
        const { result } = renderHook(() => useLeaderboard());
        await act(async () => { await result.current.getLeaderboard(); });
        expect(result.current.data).toEqual({ leaderboard: [{ username: 'alice' }] });
        expect(result.current.loading).toBe(false);
    });

    it('error sets error state', async () => {
        userService.getLeaderboard.mockRejectedValue(new Error('fail'));
        const { result } = renderHook(() => useLeaderboard());
        await act(async () => { await result.current.getLeaderboard(); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useGetDashboard', () => {
    it('success sets dashboard', async () => {
        userService.getDashboard.mockResolvedValue({ points: 100 });
        const { result } = renderHook(() => useGetDashboard());
        await act(async () => { await result.current.getDashboard(); });
        expect(result.current.dashboard).toEqual({ points: 100 });
    });

    it('error sets error', async () => {
        userService.getDashboard.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useGetDashboard());
        await act(async () => { await result.current.getDashboard(); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useGetTeacherDashboard', () => {
    it('success sets teacherDashboard', async () => {
        userService.getTeacherDashboard.mockResolvedValue({ courses: [] });
        const { result } = renderHook(() => useGetTeacherDashboard());
        await act(async () => { await result.current.getTeacherDashboard(); });
        expect(result.current.teacherDashboard).toEqual({ courses: [] });
    });

    it('error returns null and sets error', async () => {
        userService.getTeacherDashboard.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useGetTeacherDashboard());
        let ret;
        await act(async () => { ret = await result.current.getTeacherDashboard(); });
        expect(ret).toBeNull();
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useUpdateProfile', () => {
    it('success returns data and toasts', async () => {
        userService.updateProfile.mockResolvedValue({ username: 'alice2' });
        const { result } = renderHook(() => useUpdateProfile());
        let ret;
        await act(async () => { ret = await result.current.updateProfile(new FormData()); });
        expect(ret).toEqual({ data: { username: 'alice2' } });
        expect(toast.success).toHaveBeenCalledWith('Profile updated.');
    });

    it('400 error returns fieldErrors', async () => {
        userService.updateProfile.mockRejectedValue({
            response: { status: 400, data: { username: ['Already taken.'] } }
        });
        const { result } = renderHook(() => useUpdateProfile());
        let ret;
        await act(async () => { ret = await result.current.updateProfile(new FormData()); });
        expect(ret).toEqual({ fieldErrors: { username: 'Already taken.' } });
    });

    it('non-400 error returns null', async () => {
        userService.updateProfile.mockRejectedValue({ response: { status: 500, data: {} } });
        const { result } = renderHook(() => useUpdateProfile());
        let ret;
        await act(async () => { ret = await result.current.updateProfile(new FormData()); });
        expect(ret).toBeNull();
    });

    it('loading is false after completion', async () => {
        userService.updateProfile.mockResolvedValue({ username: 'x' });
        const { result } = renderHook(() => useUpdateProfile());
        await act(async () => { await result.current.updateProfile(new FormData()); });
        expect(result.current.loading).toBe(false);
    });
});
