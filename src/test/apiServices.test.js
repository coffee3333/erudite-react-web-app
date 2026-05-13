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

    it('getCourses includes category_id when set', async () => {
        apiClient.get.mockResolvedValue({ results: [] });
        await courseService.getCourses({ courseForm: { page: 1, search: '', sort_by: 'newest', category_id: 5 } });
        const call = apiClient.get.mock.calls[0];
        expect(call[1].params.category_id).toBe(5);
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

    it('createCourse calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ slug: 'new' });
        const fd = new FormData();
        await courseService.createCourse({ courseForm: fd });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/courses/create/', fd, expect.any(Object));
    });

    it('updateCourse calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({ slug: 'x' });
        const fd = new FormData();
        await courseService.updateCourse({ courseForm: fd, slug: 'x' });
        expect(apiClient.patch).toHaveBeenCalledWith('/platform/courses/x/update/', fd, expect.any(Object));
    });

    it('getCertificate calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ url: 'cert' });
        await courseService.getCertificate({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/x/certificate/');
    });

    it('downloadCertificate calls correct endpoint with blob responseType', async () => {
        apiClient.get.mockResolvedValue(new Blob());
        await courseService.downloadCertificate({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/x/certificate/download/', { responseType: 'blob' });
    });

    it('getEnrolledStudents calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await courseService.getEnrolledStudents({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/x/students/');
    });

    it('enrollStudent calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await courseService.enrollStudent({ slug: 'x', username: 'alice' });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/courses/x/students/', { username: 'alice' });
    });

    it('removeStudent calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await courseService.removeStudent({ slug: 'x', username: 'alice' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/courses/x/students/alice/');
    });

    it('getBookmarkedCourses calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await courseService.getBookmarkedCourses();
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/bookmarked/');
    });

    it('getFeedback calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await courseService.getFeedback({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/courses/x/feedback/');
    });

    it('updateFeedback calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({});
        await courseService.updateFeedback({ slug: 'x', rating: 4, comment: 'ok' });
        expect(apiClient.patch).toHaveBeenCalledWith('/platform/courses/x/feedback/mine/', { rating: 4, comment: 'ok' });
    });

    it('deleteFeedback calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await courseService.deleteFeedback({ slug: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/courses/x/feedback/delete/');
    });
});

describe('topicService', () => {
    it('getCourseTopics calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await topicService.getCourseTopics({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/topics/x/');
    });

    it('getCourseTopics error throws', async () => {
        apiClient.get.mockRejectedValue(new Error('fail'));
        await expect(topicService.getCourseTopics({ slug: 'x' })).rejects.toThrow();
    });

    it('createCourseTopics calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ id: 1 });
        const fd = new FormData();
        await topicService.createCourseTopics({ postForm: fd });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/topics/create/', fd, expect.any(Object));
    });

    it('createCourseTopics error throws', async () => {
        apiClient.post.mockRejectedValue(new Error('fail'));
        await expect(topicService.createCourseTopics({ postForm: new FormData() })).rejects.toThrow();
    });

    it('updateCourseTopic calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({ id: 1 });
        const fd = new FormData();
        await topicService.updateCourseTopic({ formTopic: fd, slug: 'x' });
        expect(apiClient.patch).toHaveBeenCalledWith('/platform/topics/x/update/', fd, expect.any(Object));
    });

    it('updateCourseTopic error throws', async () => {
        apiClient.patch.mockRejectedValue(new Error('fail'));
        await expect(topicService.updateCourseTopic({ formTopic: new FormData(), slug: 'x' })).rejects.toThrow();
    });

    it('deleteCourseTopic calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await topicService.deleteCourseTopic({ slug_topic: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/topics/x/delete/');
    });

    it('deleteCourseTopic error throws', async () => {
        apiClient.delete.mockRejectedValue(new Error('fail'));
        await expect(topicService.deleteCourseTopic({ slug_topic: 'x' })).rejects.toThrow();
    });

    it('getTopicItems calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue([]);
        await topicService.getTopicItems({ slug: 'x' });
        expect(apiClient.get).toHaveBeenCalledWith('/platform/topics/x/items/');
    });

    it('getTopicItems error throws', async () => {
        apiClient.get.mockRejectedValue(new Error('fail'));
        await expect(topicService.getTopicItems({ slug: 'x' })).rejects.toThrow();
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

    it('runCode calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ output: 'hello' });
        await challengeService.runCode({ slug_challenge: 'x', payload: { code: 'print()' } });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenges/x/run/', { code: 'print()' });
    });

    it('createChallenge calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ slug: 'new' });
        const fd = new FormData();
        await challengeService.createChallenge({ formData: fd });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenge/create/', fd, expect.any(Object));
    });

    it('createCodeChallenge calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({ slug: 'new' });
        await challengeService.createCodeChallenge({ payload: { title: 'test' } });
        expect(apiClient.post).toHaveBeenCalledWith('/platform/challenge/create-code/', { title: 'test' });
    });

    it('deleteChallenge calls correct endpoint', async () => {
        apiClient.delete.mockResolvedValue({});
        await challengeService.deleteChallenge({ slug: 'x' });
        expect(apiClient.delete).toHaveBeenCalledWith('/platform/challenges/x/delete/');
    });

    it('updateChallenge calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({ slug: 'x' });
        const fd = new FormData();
        await challengeService.updateChallenge({ slug: 'x', formData: fd });
        expect(apiClient.patch).toHaveBeenCalledWith('/platform/challenges/x/update/', fd, expect.any(Object));
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

    it('getDashboard calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ points: 100 });
        await userService.getDashboard();
        expect(apiClient.get).toHaveBeenCalledWith('/users/dashboard/');
    });

    it('getLeaderboard calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ leaderboard: [] });
        await userService.getLeaderboard();
        expect(apiClient.get).toHaveBeenCalledWith('/users/leaderboard/');
    });

    it('getTeacherDashboard calls correct endpoint', async () => {
        apiClient.get.mockResolvedValue({ courses: [] });
        await userService.getTeacherDashboard();
        expect(apiClient.get).toHaveBeenCalledWith('/users/teacher-dashboard/');
    });

    it('requestEmailVerification calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.requestEmailVerification();
        expect(apiClient.post).toHaveBeenCalledWith('/users/users/me/email/verify/request/');
    });

    it('requestPasswordReset calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.requestPasswordReset({ email: 'x@x.com' });
        expect(apiClient.post).toHaveBeenCalledWith('/users/auth/password/reset/request/', { email: 'x@x.com' }, expect.any(Object));
    });

    it('confirmPasswordReset calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.confirmPasswordReset({ email: 'x@x.com', otp_code: '123', new_password: 'pw' });
        expect(apiClient.post).toHaveBeenCalledWith(
            '/users/auth/password/reset/confirm/',
            { email: 'x@x.com', otp_code: '123', new_password: 'pw' },
            expect.any(Object)
        );
    });

    it('confirmEmailVerification calls correct endpoint', async () => {
        apiClient.post.mockResolvedValue({});
        await userService.confirmEmailVerification({ code: '123456' });
        expect(apiClient.post).toHaveBeenCalledWith('/users/users/me/email/verify/confirm/', { code: '123456' });
    });

    it('updateProfile calls correct endpoint', async () => {
        apiClient.patch.mockResolvedValue({ username: 'alice' });
        const fd = new FormData();
        await userService.updateProfile(fd);
        expect(apiClient.patch).toHaveBeenCalledWith('/users/profile/me/update/', fd);
    });
});
