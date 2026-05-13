import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useGetChallenges from '../hooks/challengeHooks/useGetChallenges.jsx';
import useSubmitChallenge from '../hooks/challengeHooks/useSubmitChallenge.jsx';
import useHintReveal from '../hooks/challengeHooks/useHintReveal.jsx';
import useDeleteChallenge from '../hooks/challengeHooks/useDeleteChallenge.jsx';
import useUpdateChallenge from '../hooks/challengeHooks/useUpdateChallenge.jsx';
import useCreateChallenge from '../hooks/challengeHooks/useCreateChallenge.jsx';
import useRunCode from '../hooks/challengeHooks/useRunCode.jsx';

vi.mock('../api/endpoints/challengeService.jsx', () => ({
    default: {
        getChallengesViaTopic: vi.fn(),
        submitAnswer: vi.fn(),
        useHint: vi.fn(),
        revealSolution: vi.fn(),
        deleteChallenge: vi.fn(),
        updateChallenge: vi.fn(),
        createChallenge: vi.fn(),
        createCodeChallenge: vi.fn(),
        runCode: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import challengeService from '../api/endpoints/challengeService.jsx';
import toast from 'react-hot-toast';

beforeEach(() => vi.clearAllMocks());

describe('useGetChallenges', () => {
    it('success sets challenges', async () => {
        challengeService.getChallengesViaTopic.mockResolvedValue([{ id: 1 }]);
        const { result } = renderHook(() => useGetChallenges());
        await act(async () => { await result.current.getChallengesViaTopic({ slug_topic: 'x' }); });
        expect(result.current.challenges).toEqual([{ id: 1 }]);
    });

    it('no slug sets error', async () => {
        const { result } = renderHook(() => useGetChallenges());
        await act(async () => { await result.current.getChallengesViaTopic({ slug_topic: null }); });
        expect(result.current.error).toBeInstanceOf(Error);
        expect(challengeService.getChallengesViaTopic).not.toHaveBeenCalled();
    });

    it('error sets error state', async () => {
        challengeService.getChallengesViaTopic.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useGetChallenges());
        await act(async () => { await result.current.getChallengesViaTopic({ slug_topic: 'x' }); });
        expect(result.current.error).toBeInstanceOf(Error);
    });
});

describe('useSubmitChallenge', () => {
    it('correct answer shows success toast', async () => {
        challengeService.submitAnswer.mockResolvedValue({ correct: true, score: 10 });
        const { result } = renderHook(() => useSubmitChallenge());
        let ret;
        await act(async () => { ret = await result.current.submitAnswer({ slug_challenge: 'x', payload: {} }); });
        expect(ret).toEqual({ correct: true, score: 10 });
        expect(toast.success).toHaveBeenCalled();
    });

    it('wrong answer shows error toast', async () => {
        challengeService.submitAnswer.mockResolvedValue({ correct: false, score: 0 });
        const { result } = renderHook(() => useSubmitChallenge());
        await act(async () => { await result.current.submitAnswer({ slug_challenge: 'x', payload: {} }); });
        expect(toast.error).toHaveBeenCalled();
    });

    it('service error returns null', async () => {
        challengeService.submitAnswer.mockRejectedValue(new Error('err'));
        const { result } = renderHook(() => useSubmitChallenge());
        let ret;
        await act(async () => { ret = await result.current.submitAnswer({ slug_challenge: 'x', payload: {} }); });
        expect(ret).toBeNull();
    });
});

describe('useHintReveal', () => {
    it('useHint success returns result', async () => {
        challengeService.useHint.mockResolvedValue({ hint: 'think' });
        const { result } = renderHook(() => useHintReveal());
        let ret;
        await act(async () => { ret = await result.current.useHint({ slug: 'x' }); });
        expect(ret).toEqual({ hint: 'think' });
    });

    it('useHint error returns null', async () => {
        challengeService.useHint.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useHintReveal());
        let ret;
        await act(async () => { ret = await result.current.useHint({ slug: 'x' }); });
        expect(ret).toBeNull();
    });

    it('revealSolution success returns result', async () => {
        challengeService.revealSolution.mockResolvedValue({ solution_explanation: 'Paris' });
        const { result } = renderHook(() => useHintReveal());
        let ret;
        await act(async () => { ret = await result.current.revealSolution({ slug: 'x' }); });
        expect(ret).toEqual({ solution_explanation: 'Paris' });
    });

    it('revealSolution error returns null', async () => {
        challengeService.revealSolution.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useHintReveal());
        let ret;
        await act(async () => { ret = await result.current.revealSolution({ slug: 'x' }); });
        expect(ret).toBeNull();
    });
});

describe('useDeleteChallenge', () => {
    it('success returns true and toasts', async () => {
        challengeService.deleteChallenge.mockResolvedValue({});
        const { result } = renderHook(() => useDeleteChallenge());
        let ret;
        await act(async () => { ret = await result.current.deleteChallenge({ slug: 'x' }); });
        expect(ret).toBe(true);
        expect(toast.success).toHaveBeenCalled();
    });

    it('error returns false', async () => {
        challengeService.deleteChallenge.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useDeleteChallenge());
        let ret;
        await act(async () => { ret = await result.current.deleteChallenge({ slug: 'x' }); });
        expect(ret).toBe(false);
    });
});

describe('useUpdateChallenge', () => {
    it('success returns result and toasts', async () => {
        challengeService.updateChallenge.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useUpdateChallenge());
        let ret;
        await act(async () => { ret = await result.current.updateChallenge({ slug: 'x', formData: {} }); });
        expect(ret).toEqual({ id: 1 });
        expect(toast.success).toHaveBeenCalled();
    });

    it('error returns null', async () => {
        challengeService.updateChallenge.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useUpdateChallenge());
        let ret;
        await act(async () => { ret = await result.current.updateChallenge({ slug: 'x', formData: {} }); });
        expect(ret).toBeNull();
    });
});

describe('useCreateChallenge', () => {
    it('createChallenge success returns result', async () => {
        challengeService.createChallenge.mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useCreateChallenge());
        let ret;
        await act(async () => { ret = await result.current.createChallenge({ formData: new FormData() }); });
        expect(ret).toEqual({ id: 1 });
        expect(toast.success).toHaveBeenCalled();
    });

    it('createChallenge error returns null', async () => {
        challengeService.createChallenge.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useCreateChallenge());
        let ret;
        await act(async () => { ret = await result.current.createChallenge({ formData: new FormData() }); });
        expect(ret).toBeNull();
    });

    it('createCodeChallenge success returns result', async () => {
        challengeService.createCodeChallenge.mockResolvedValue({ id: 2 });
        const { result } = renderHook(() => useCreateChallenge());
        let ret;
        await act(async () => { ret = await result.current.createCodeChallenge({ payload: {} }); });
        expect(ret).toEqual({ id: 2 });
    });
});

describe('useRunCode', () => {
    it('success sets runResult', async () => {
        challengeService.runCode.mockResolvedValue({ status: 'accepted' });
        const { result } = renderHook(() => useRunCode());
        let ret;
        await act(async () => { ret = await result.current.runCode({ slug_challenge: 'x', payload: {} }); });
        expect(ret).toEqual({ status: 'accepted' });
        expect(result.current.runResult).toEqual({ status: 'accepted' });
    });

    it('error returns null', async () => {
        challengeService.runCode.mockRejectedValue(new Error('e'));
        const { result } = renderHook(() => useRunCode());
        let ret;
        await act(async () => { ret = await result.current.runCode({ slug_challenge: 'x', payload: {} }); });
        expect(ret).toBeNull();
    });

    it('clearRunResult sets null', async () => {
        challengeService.runCode.mockResolvedValue({ status: 'ok' });
        const { result } = renderHook(() => useRunCode());
        await act(async () => { await result.current.runCode({ slug_challenge: 'x', payload: {} }); });
        act(() => { result.current.clearRunResult(); });
        expect(result.current.runResult).toBeNull();
    });
});
