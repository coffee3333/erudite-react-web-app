import apiClient from '../apiClient';

const challengeService = {
    getChallengesViaTopic: async ({ slug_topic } ) => {
        try {
            return await apiClient.get(`/platform/topics/${slug_topic}/challenges/`,{
                requiresAuth: false
            });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    checkAnswer: async ({ slug_challenge } ) => {
        try {
            return await apiClient.get(`/platform/challenges/${slug_challenge}/check/`,{
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                requiresAuth: false
            });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },
};

export default challengeService;