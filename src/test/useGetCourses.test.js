import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGetCourses from '../hooks/courseHooks/useGetCourses.jsx';

vi.mock('../api/endpoints/courseService.jsx', () => ({
    default: {
        getCourses: vi.fn(),
    },
}));

import courseService from '../api/endpoints/courseService.jsx';

describe('useGetCourses', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial state has empty courses and loading false', () => {
        const { result } = renderHook(() => useGetCourses());
        expect(result.current.courses).toEqual([]);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.loading).toBe(false);
    });

    it('fetchCourses sets courses and totalCount on success', async () => {
        courseService.getCourses.mockResolvedValue({
            results: [{ id: 1, title: 'Course A' }],
            count: 1,
        });
        const { result } = renderHook(() => useGetCourses());
        await act(async () => {
            await result.current.fetchCourses({ search: '' });
        });
        expect(result.current.courses).toEqual([{ id: 1, title: 'Course A' }]);
        expect(result.current.totalCount).toBe(1);
    });

    it('fetchCourses with null form returns early without calling service', async () => {
        const { result } = renderHook(() => useGetCourses());
        await act(async () => {
            await result.current.fetchCourses(null);
        });
        expect(courseService.getCourses).not.toHaveBeenCalled();
    });

    it('fetchCourses sets loading false after success', async () => {
        courseService.getCourses.mockResolvedValue({ results: [], count: 0 });
        const { result } = renderHook(() => useGetCourses());
        await act(async () => {
            await result.current.fetchCourses({ search: '' });
        });
        expect(result.current.loading).toBe(false);
    });

    it('fetchCourses sets loading false after error', async () => {
        courseService.getCourses.mockRejectedValue(new Error('Network'));
        const { result } = renderHook(() => useGetCourses());
        await act(async () => {
            await result.current.fetchCourses({ search: '' });
        });
        expect(result.current.loading).toBe(false);
    });
});
