import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGetCourseDetail from '../hooks/courseHooks/useGetCourseDetail.jsx';

vi.mock('../api/endpoints/courseService.jsx', () => ({
    default: {
        getCourseDetail: vi.fn(),
    },
}));

import courseService from '../api/endpoints/courseService.jsx';

describe('useGetCourseDetail', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initial state is null course and loading false', () => {
        const { result } = renderHook(() => useGetCourseDetail());
        expect(result.current.course).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('getCourse success sets course data', async () => {
        const mockCourse = { id: 1, title: 'My Course', slug: 'my-course' };
        courseService.getCourseDetail.mockResolvedValue(mockCourse);
        const { result } = renderHook(() => useGetCourseDetail());
        let returned;
        await act(async () => {
            returned = await result.current.getCourse('my-course');
        });
        expect(result.current.course).toEqual(mockCourse);
        expect(returned).toEqual(mockCourse);
    });

    it('getCourse with empty slug sets error and returns null', async () => {
        const { result } = renderHook(() => useGetCourseDetail());
        let returned;
        await act(async () => {
            returned = await result.current.getCourse('');
        });
        expect(returned).toBeNull();
        expect(result.current.error).toBeTruthy();
        expect(courseService.getCourseDetail).not.toHaveBeenCalled();
    });

    it('getCourse api error sets error state', async () => {
        const err = new Error('Not found');
        courseService.getCourseDetail.mockRejectedValue(err);
        const { result } = renderHook(() => useGetCourseDetail());
        await act(async () => {
            await result.current.getCourse('bad-slug');
        });
        expect(result.current.error).toBe(err);
        expect(result.current.course).toBeNull();
    });

    it('getCourse sets loading false after completion', async () => {
        courseService.getCourseDetail.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useGetCourseDetail());
        await act(async () => {
            await result.current.getCourse('some-slug');
        });
        expect(result.current.loading).toBe(false);
    });
});
