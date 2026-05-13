import apiClient from '../apiClient';

const challengeService = {
    getChallengesViaTopic: async ({ slug_topic }) => {
        return await apiClient.get(`/platform/topics/${slug_topic}/challenges/`);
    },

    submitAnswer: async ({ slug_challenge, payload }) => {
        return await apiClient.post(`/platform/challenges/${slug_challenge}/submit/`, payload);
    },

    runCode: async ({ slug_challenge, payload }) => {
        return await apiClient.post(`/platform/challenges/${slug_challenge}/run/`, payload);
    },

    createChallenge: async ({ formData }) => {
        return await apiClient.post('/platform/challenge/create/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    createCodeChallenge: async ({ payload }) => {
        return await apiClient.post('/platform/challenge/create-code/', payload);
    },

    deleteChallenge: async ({ slug }) => {
        return await apiClient.delete(`/platform/challenges/${slug}/delete/`);
    },

    updateChallenge: async ({ slug, formData }) => {
        return await apiClient.patch(`/platform/challenges/${slug}/update/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    useHint: async ({ slug }) => {
        return await apiClient.post(`/platform/challenges/${slug}/use-hint/`);
    },

    revealSolution: async ({ slug }) => {
        return await apiClient.post(`/platform/challenges/${slug}/reveal-solution/`);
    },
};

export default challengeService;
