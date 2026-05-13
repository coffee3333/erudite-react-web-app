import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useEnrollment from '../hooks/enrollmentHooks/useEnrollment.jsx';

vi.mock('../api/endpoints/courseService.jsx', () => ({
    default: {
        getEnrolledStudents: vi.fn(),
        enrollStudent: vi.fn(),
        removeStudent: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import courseService from '../api/endpoints/courseService.jsx';
import toast from 'react-hot-toast';

beforeEach(() => vi.clearAllMocks());

describe('useEnrollment', () => {
    it('initial state is empty', () => {
        const { result } = renderHook(() => useEnrollment('course-slug'));
        expect(result.current.students).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    it('fetchStudents sets students', async () => {
        courseService.getEnrolledStudents.mockResolvedValue([{ username: 'alice' }]);
        const { result } = renderHook(() => useEnrollment('course-slug'));
        await act(async () => { await result.current.fetchStudents(); });
        expect(result.current.students).toEqual([{ username: 'alice' }]);
    });

    it('fetchStudents error sets empty array', async () => {
        courseService.getEnrolledStudents.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useEnrollment('course-slug'));
        await act(async () => { await result.current.fetchStudents(); });
        expect(result.current.students).toEqual([]);
    });

    it('enrollStudent success adds student and toasts', async () => {
        courseService.enrollStudent.mockResolvedValue({ username: 'bob' });
        const { result } = renderHook(() => useEnrollment('course-slug'));
        let ret;
        await act(async () => { ret = await result.current.enrollStudent('bob'); });
        expect(ret).toBe(true);
        expect(result.current.students).toContainEqual({ username: 'bob' });
        expect(toast.success).toHaveBeenCalled();
    });

    it('enrollStudent error returns false and toasts error', async () => {
        courseService.enrollStudent.mockRejectedValue({ response: { data: { detail: 'User not found.' } } });
        const { result } = renderHook(() => useEnrollment('course-slug'));
        let ret;
        await act(async () => { ret = await result.current.enrollStudent('nobody'); });
        expect(ret).toBe(false);
        expect(toast.error).toHaveBeenCalledWith('User not found.');
    });

    it('removeStudent removes from list and toasts', async () => {
        courseService.getEnrolledStudents.mockResolvedValue([{ username: 'alice' }, { username: 'bob' }]);
        courseService.removeStudent.mockResolvedValue({});
        const { result } = renderHook(() => useEnrollment('course-slug'));
        await act(async () => { await result.current.fetchStudents(); });
        await act(async () => { await result.current.removeStudent('alice'); });
        expect(result.current.students).toEqual([{ username: 'bob' }]);
        expect(toast.success).toHaveBeenCalled();
    });

    it('removeStudent error toasts error', async () => {
        courseService.removeStudent.mockRejectedValue({ response: { data: { detail: 'Not enrolled.' } } });
        const { result } = renderHook(() => useEnrollment('course-slug'));
        await act(async () => { await result.current.removeStudent('nobody'); });
        expect(toast.error).toHaveBeenCalledWith('Not enrolled.');
    });
});
