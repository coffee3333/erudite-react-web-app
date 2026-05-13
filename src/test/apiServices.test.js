import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../api/apiClient.jsx', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('../stores/authStore.jsx', () => {
    const setIsLoading = vi.fn();
    const setError = vi.fn();
    const setAccessToken = vi.fn();
    const setRefreshToken = vi.fn();
    const setUser = vi.fn();
    const setIsLoggedIn = vi.fn();
    const logout = vi.fn();
    const store = vi.fn(() => null);
    store.getState = vi.fn(() => ({
        setIsLoading, setError, setAccessToken, setRefreshToken,
        setUser, setIsLoggedIn, logout, refreshToken: 'tok',
    }));
    return { default: store };
});

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}));

import apiClient from '../api/apiClient.jsx';
import authService from '../api/endpoints/authService.jsx';
import courseService from '../api/endpoints/courseService.jsx';
import topicService from '../api/endpoints/topicService.jsx';
import challengeService from '../api/endpoints/challengeService.jsx';
import lessonService from '../api/endpoints/lessonService.jsx';
import userService from '../api/endpoints/userService.jsx';

beforeEach(() => vi.clearAllMocks());

describe('authService', () => {
    it('login calls apiClient.post and apiClient.get', async () => {
        apiClient.post.mockResolvedValue({ access: 'a', refresh: 'r' });
        apiClient.get.mockResolvedValue({ id: 1, role: 'student' });
        await authService.login({ email: 'x@x.com', password: '123' });
        expect(apiClient.post).toHaveBeenCalledWith('/users/auth/login/', expect.any(Object));
        expect(apiClient.get).toHaveBeenCalledWith('/users/profile/me/');
    });

    it('login error throws', async () => {
        apiClient.post.mockRejectedValue(new Error('bad credentials'));
        await expect(authService.login({ email: 'x', password: 'y' })).rejects.toThrow();
    });

    it('registration calls apiClient.post', async () => {
        apiClient.post.mockResolvedValue({});
        const fd = new FormData();
        await authService.registration({ registrationForm: fd });
        expect(apiClient.post).toHaveBeenCalledWith('/users/auth/registration/', fd, expect.any(Object));
    });

    it('logout calls apiClient.post with refresh token', async () => {
        apiClient.post.mockResolvedValue({});
        await authService.logout();
        expect(apiClient.post).toHaveBeenCalledWith('/users/auth/logout/', { refresh: 'tok' });
    });
});

describe('courseService', () => {
    it('getCourseDetail calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ slug: 'x' });
        await courseService.getCourseDetail({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/x/');
    });

    it('getCourses calls with params', async () => {
        apiClient.get.mockResolvedValue({ results: [] });
        await courseService.getCourses({ courseForm: { page: 1, search: 'test', sort_by: 'newest' } });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/', expect.objectContaining({ params: expect.any(Object) }));
    });

    it('toggleBookmark calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ bookmarked: true });
        await courseService.toggleBookmark({ slug: 'x' });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/courses/x/bookmark/');
    });

    it('deleteCourse calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await courseService.deleteCourse({ slug: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/courses/x/delete/');
    });

    it('submitFeedback calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ id: 1 });
        await courseService.submitFeedback({ slug: 'x', rating: 5, comment: 'great' });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/courses/x/feedback/submit/', { rating: 5, comment: 'great' });
    });
});

describe('topicService', () => {
    it('getCourseTopics calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await topicService.getCourseTopics({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/topics/x/');
    });

    it('deleteCourseTopic calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await topicService.deleteCourseTopic({ slug_topic: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/topics/x/delete/');
    });

    it('getTopicItems calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await topicService.getTopicItems({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/topics/x/items/');
    });
});

describe('challengeService', () => {
    it('getChallengesViaTopic calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await challengeService.getChallengesViaTopic({ slug_topic: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/topics/x/challenges/');
    });

    it('submitAnswer calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ correct: true });
        await challengeService.submitAnswer({ slug_challenge: 'x', payload: { option_id: 1 } });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenges/x/submit/', { option_id: 1 });
    });

    it('useHint calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ hint: 'think' });
        await challengeService.useHint({ slug: 'x' });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenges/x/use-hint/');
    });

    it('revealSolution calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ solution_explanation: 'Paris' });
        await challengeService.revealSolution({ slug: 'x' });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenges/x/reveal-solution/');
    });
});

describe('lessonService', () => {
    it('deleteLesson calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await lessonService.deleteLesson({ slug: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/lessons/x/delete/');
    });

    it('updateLesson calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({ id: 1 });
        await lessonService.updateLesson({ slug: 'x', payload: { title: 'Updated' } });
        expect(apiClient.patch).toHaveBeenCalledWith('/platform/lessons/x/update/', expect.any(Object), expect.any(Object));
    });
});

describe('userService', () => {
    it('getProfile calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ id: 1 });
        await userService.getProfile();
        expect(apiClient.get).toHaveBeenCalledWith('/users/profile/me/');
    });

    it('getLeaderboard calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ leaderboard: [] });
        await userService.getLeaderboard();
        expect(apiClient.get).toHaveBeenCalledWith('/users/leaderboard/');
    });

    it('requestPasswordReset calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.requestPasswordReset({ email: 'x@x.com' });
        expect(apiClient.post).toHaveBeenCalledWith('/users/auth/password/reset/request/', { email: 'x@x.com' }, expect.any(Object));
    });

    it('confirmEmailVerification calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.confirmEmailVerification({ code: '123456' });
        expect(apiClient.post).toHaveBeenCalledWith('/users/users/me/email/verify/confirm/', { code: '123456' });
    });
});
