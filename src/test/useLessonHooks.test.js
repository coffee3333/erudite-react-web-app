import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCreateLesson from '../hooks/lessonHooks/useCreateLesson.jsx';
import useDeleteLesson from '../hooks/lessonHooks/useDeleteLesson.jsx';
import useUpdateLesson from '../hooks/lessonHooks/useUpdateLesson.jsx';

vi.mock('../api/endpoints/lessonService.jsx', () => ({
    default: {
        createLesson: vi.fn(),
        deleteLesson: vi.fn(),
        updateLesson: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import lessonService from '../api/endpoints/lessonService.jsx';
import toast from 'react-hot-toast';

beforeEach(() => vi.clearAllMocks());

describe('useCreateLesson', () => {
    it('success returns result and toasts', async () => {
        lessonService.createLesson.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useCreateLesson());
        let ret;
        await act(async () => {
            ret = await result.current.createLesson({ topicSlug: 'x', title: 'Lesson 1' });
        });
        expect(ret).toEqual({ id: 1 });
        expect(toast.success).toHaveBeenCalledWith('Lesson created.');
    });

    it('error returns null', async () => {
        lessonService.createLesson.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useCreateLesson());
        let ret;
        await act(async () => {
            ret = await result.current.createLesson({ topicSlug: 'x', title: 'L' });
        });
        expect(ret).toBeNull();
    });

    it('loading is false after completion', async () => {
        lessonService.createLesson.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useCreateLesson());
        await act(async () => { await result.current.createLesson({ topicSlug: 'x', title: 'L' }); });
        expect(result.current.loading).toBe(false);
    });
});

describe('useDeleteLesson', () => {
    it('success returns true and toasts', async () => {
        lessonService.deleteLesson.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteLesson());
        let ret;
        await act(async () => { ret = await result.current.deleteLesson({ slug: 'x' }); });
        expect(ret).toBe(true);
        expect(toast.success).toHaveBeenCalledWith('Lesson deleted.');
    });

    it('error returns false', async () => {
        lessonService.deleteLesson.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useDeleteLesson());
        let ret;
        await act(async () => { ret = await result.current.deleteLesson({ slug: 'x' }); });
        expect(ret).toBe(false);
    });
});

describe('useUpdateLesson', () => {
    it('success returns result and toasts', async () => {
        lessonService.updateLesson.mockResolvedValue({ id: 1, title: 'Updated' });
        const { result } = renderHook(() => useUpdateLesson());
        let ret;
        await act(async () => { ret = await result.current.updateLesson({ slug: 'x', payload: { title: 'Updated' } }); });
        expect(ret).toEqual({ id: 1, title: 'Updated' });
        expect(toast.success).toHaveBeenCalledWith('Lesson saved.');
    });

    it('error returns null', async () => {
        lessonService.updateLesson.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useUpdateLesson());
        let ret;
        await act(async () => { ret = await result.current.updateLesson({ slug: 'x', payload: {} }); });
        expect(ret).toBeNull();
    });
});
