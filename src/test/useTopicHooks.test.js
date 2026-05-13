import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCreateTopic from '../hooks/topicHooks/useCreateTopic.jsx';
import useDeleteTopic from '../hooks/topicHooks/useDeleteTopic.jsx';
import useGetTopics from '../hooks/topicHooks/useGetTopics.jsx';
import useGetTopicDetail from '../hooks/topicHooks/useGetTopicDetail.jsx';
import useUpdateTopic from '../hooks/topicHooks/useUpdateTopic.jsx';

vi.mock('../api/endpoints/topicService.jsx', () => ({
    default: {
        createCourseTopics: vi.fn(),
        deleteCourseTopic: vi.fn(),
        getCourseTopics: vi.fn(),
        getTopicItems: vi.fn(),
        updateCourseTopic: vi.fn(),
    },
}));

import topicService from '../api/endpoints/topicService.jsx';

beforeEach(() => vi.clearAllMocks());

describe('useCreateTopic', () => {
    it('initial state', () => {
        const { result } = renderHook(() => useCreateTopic());
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('success returns true', async () => {
        topicService.createCourseTopics.mockResolvedValue({});
        const { result } = renderHook(() => useCreateTopic());
        let ret;
        await act(async () => { ret = await result.current.createTopic({ slug: 'c', title: 'T' }); });
        expect(ret).toBe(true);
        expect(result.current.loading).toBe(false);
    });

    it('error sets error state', async () => {
        topicService.createCourseTopics.mockRejectedValue(new Error('fail'));
        const { result } = renderHook(() => useCreateTopic());
        await act(async () => { await result.current.createTopic({ slug: 'c', title: 'T' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useDeleteTopic', () => {
    it('success returns true', async () => {
        topicService.deleteCourseTopic.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteTopic());
        let ret;
        await act(async () => { ret = await result.current.deleteTopic({ slug_topic: 'x' }); });
        expect(ret).toBe(true);
    });

    it('error sets error state', async () => {
        topicService.deleteCourseTopic.mockRejectedValue(new Error('boom'));
        const { result } = renderHook(() => useDeleteTopic());
        await act(async () => { await result.current.deleteTopic({ slug_topic: 'x' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useGetTopics', () => {
    it('success sets topics', async () => {
        topicService.getCourseTopics.mockResolvedValue([{ id: 1 }]);
        const { result } = renderHook(() => useGetTopics());
        await act(async () => { await result.current.getTopics('course-slug'); });
        expect(result.current.topics).toEqual([{ id: 1 }]);
    });

    it('error sets error state', async () => {
        topicService.getCourseTopics.mockRejectedValue(new Error('err'));
        const { result } = renderHook(() => useGetTopics());
        await act(async () => { await result.current.getTopics('course-slug'); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useGetTopicDetail', () => {
    it('success sets topic', async () => {
        topicService.getTopicItems.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useGetTopicDetail());
        await act(async () => { await result.current.getTopicDetail({ slug: 'abc' }); });
        expect(result.current.topic).toEqual({ id: 1 });
    });

    it('no slug returns early', async () => {
        const { result } = renderHook(() => useGetTopicDetail());
        await act(async () => { await result.current.getTopicDetail({ slug: null }); });
        expect(topicService.getTopicItems).not.toHaveBeenCalled();
    });

    it('error sets error', async () => {
        topicService.getTopicItems.mockRejectedValue(new Error('err'));
        const { result } = renderHook(() => useGetTopicDetail());
        await act(async () => { await result.current.getTopicDetail({ slug: 'x' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useUpdateTopic', () => {
    it('success returns true', async () => {
        topicService.updateCourseTopic.mockResolvedValue({});
        const { result } = renderHook(() => useUpdateTopic());
        let ret;
        await act(async () => { ret = await result.current.updateTopic({ slug: 'x', title: 'T' }); });
        expect(ret).toBe(true);
    });

    it('error sets error', async () => {
        topicService.updateCourseTopic.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useUpdateTopic());
        await act(async () => { await result.current.updateTopic({ slug: 'x', title: 'T' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});
