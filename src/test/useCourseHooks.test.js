import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useBookmark from '../hooks/courseHooks/useBookmark.jsx';
import useCourseFeedback from '../hooks/courseHooks/useCourseFeedback.jsx';
import useDeleteCourse from '../hooks/courseHooks/useDeleteCourse.jsx';
import useUpdateCourse from '../hooks/courseHooks/useUpdateCourse.jsx';
import useGetCertificate from '../hooks/courseHooks/useGetCertificate.jsx';

vi.mock('../api/endpoints/courseService.jsx', () => ({
    default: {
        toggleBookmark: vi.fn(),
        getFeedback: vi.fn(),
        submitFeedback: vi.fn(),
        updateFeedback: vi.fn(),
        deleteFeedback: vi.fn(),
        deleteCourse: vi.fn(),
        updateCourse: vi.fn(),
        getCertificate: vi.fn(),
        downloadCertificate: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import courseService from '../api/endpoints/courseService.jsx';
import toast from 'react-hot-toast';

beforeEach(() => vi.clearAllMocks());

describe('useBookmark', () => {
    it('toggleBookmark success returns bookmarked value', async () => {
        courseService.toggleBookmark.mockResolvedValue({ bookmarked: true });
        const { result } = renderHook(() => useBookmark());
        let ret;
        await act(async () => { ret = await result.current.toggleBookmark({ slug: 'x', onToggled: vi.fn() }); });
        expect(ret).toBe(true);
    });

    it('toggleBookmark error returns null', async () => {
        courseService.toggleBookmark.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useBookmark());
        let ret;
        await act(async () => { ret = await result.current.toggleBookmark({ slug: 'x' }); });
        expect(ret).toBeNull();
    });

    it('calls onToggled callback with bookmarked value', async () => {
        courseService.toggleBookmark.mockResolvedValue({ bookmarked: false });
        const onToggled = vi.fn();
        const { result } = renderHook(() => useBookmark());
        await act(async () => { await result.current.toggleBookmark({ slug: 'x', onToggled }); });
        expect(onToggled).toHaveBeenCalledWith(false);
    });
});

describe('useCourseFeedback', () => {
    it('fetchFeedback sets feedback', async () => {
        courseService.getFeedback.mockResolvedValue([{ id: 1 }]);
        const { result } = renderHook(() => useCourseFeedback());
        await act(async () => { await result.current.fetchFeedback('x'); });
        expect(result.current.feedback).toEqual([{ id: 1 }]);
    });

    it('fetchFeedback error sets empty array', async () => {
        courseService.getFeedback.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useCourseFeedback());
        await act(async () => { await result.current.fetchFeedback('x'); });
        expect(result.current.feedback).toEqual([]);
    });

    it('submitFeedback adds to feedback list', async () => {
        courseService.submitFeedback.mockResolvedValue({ id: 2, rating: 5 });
        const { result } = renderHook(() => useCourseFeedback());
        await act(async () => { await result.current.submitFeedback({ slug: 'x', rating: 5, comment: 'good' }); });
        expect(result.current.feedback).toContainEqual({ id: 2, rating: 5 });
    });

    it('deleteFeedback removes own feedback', async () => {
        courseService.getFeedback.mockResolvedValue([{ id: 1, is_own: true }, { id: 2, is_own: false }]);
        courseService.deleteFeedback.mockResolvedValue({});
        const { result } = renderHook(() => useCourseFeedback());
        await act(async () => { await result.current.fetchFeedback('x'); });
        await act(async () => { await result.current.deleteFeedback({ slug: 'x' }); });
        expect(result.current.feedback).toEqual([{ id: 2, is_own: false }]);
    });
});

describe('useDeleteCourse', () => {
    it('success returns true', async () => {
        courseService.deleteCourse.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteCourse());
        let ret;
        await act(async () => { ret = await result.current.deleteCourse({ slug: 'x' }); });
        expect(ret).toBe(true);
    });

    it('error sets error state', async () => {
        courseService.deleteCourse.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useDeleteCourse());
        await act(async () => { await result.current.deleteCourse({ slug: 'x' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useUpdateCourse', () => {
    it('success returns true and toasts', async () => {
        courseService.updateCourse.mockResolvedValue({});
        const { result } = renderHook(() => useUpdateCourse('course-slug'));
        let ret;
        await act(async () => { ret = await result.current.updateCourse(new FormData()); });
        expect(ret).toBe(true);
        expect(toast.success).toHaveBeenCalledWith('Course edited successfully.');
    });

    it('error returns null', async () => {
        courseService.updateCourse.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useUpdateCourse('course-slug'));
        let ret;
        await act(async () => { ret = await result.current.updateCourse(new FormData()); });
        expect(ret).toBeNull();
    });
});

describe('useGetCertificate', () => {
    it('getCertificate success sets certificate', async () => {
        courseService.getCertificate.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useGetCertificate());
        let ret;
        await act(async () => { ret = await result.current.getCertificate({ slug: 'x' }); });
        expect(ret).toEqual({ id: 1 });
        expect(result.current.certificate).toEqual({ id: 1 });
    });

    it('getCertificate error returns null', async () => {
        courseService.getCertificate.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useGetCertificate());
        let ret;
        await act(async () => { ret = await result.current.getCertificate({ slug: 'x' }); });
        expect(ret).toBeNull();
        expect(result.current.certificate).toBeNull();
    });
});
