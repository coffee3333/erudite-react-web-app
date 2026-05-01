import apiClient from '../apiClient';

const userService = {
    getProfile: async () => {
        return await apiClient.get('/users/profile/me/');
    },

    getDashboard: async () => {
        return await apiClient.get('/users/dashboard/');
    },

    getLeaderboard: async () => {
        return await apiClient.get('/users/leaderboard/');
    },

    getTeacherDashboard: async () => {
        return await apiClient.get('/users/teacher-dashboard/');
    },

    requestEmailVerification: async () => {
        return await apiClient.post('/users/users/me/email/verify/request/');
    },

    confirmEmailVerification: async ({ code }) => {
        return await apiClient.post('/users/users/me/email/verify/confirm/', { code });
    },

    requestPasswordReset: async ({ email }) => {
        return await apiClient.post('/users/auth/password/reset/request/', { email }, { requiresAuth: false });
    },

    confirmPasswordReset: async ({ email, otp_code, new_password }) => {
        return await apiClient.post('/users/auth/password/reset/confirm/', { email, otp_code, new_password }, { requiresAuth: false });
    },

    updateProfile: async (formData) =>
        apiClient.patch('/users/profile/me/update/', formData),
};

export default userService;
