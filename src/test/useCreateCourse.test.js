import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCreateCourse from '../hooks/courseHooks/useCreateCourse.jsx';

vi.mock('../api/endpoints/courseService.jsx', () => ({
    default: {
        createCourse: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import courseService from '../api/endpoints/courseService.jsx';
import toast from 'react-hot-toast';

describe('useCreateCourse', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial loading is false', () => {
        const { result } = renderHook(() => useCreateCourse());
        expect(result.current.loading).toBe(false);
    });

    it('createCourse success returns slug and shows toast', async () => {
        courseService.createCourse.mockResolvedValue({ slug: 'new-course' });
        const { result } = renderHook(() => useCreateCourse());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.createCourse(new FormData());
        });
        expect(returnVal).toBe('new-course');
        expect(toast.success).toHaveBeenCalledWith('Course created successfully.');
    });

    it('createCourse with no slug in response returns null', async () => {
        courseService.createCourse.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useCreateCourse());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.createCourse(new FormData());
        });
        expect(returnVal).toBeNull();
        expect(toast.success).not.toHaveBeenCalled();
    });

    it('createCourse on service error returns null without throwing', async () => {
        courseService.createCourse.mockRejectedValue(new Error('Forbidden'));
        const { result } = renderHook(() => useCreateCourse());
        let returnVal;
        await act(async () => {
            returnVal = await result.current.createCourse(new FormData());
        });
        expect(returnVal).toBeNull();
    });

    it('createCourse sets loading false after completion', async () => {
        courseService.createCourse.mockResolvedValue({ slug: 'x' });
        const { result } = renderHook(() => useCreateCourse());
        await act(async () => {
            await result.current.createCourse(new FormData());
        });
        expect(result.current.loading).toBe(false);
    });
});
