import apiClient from '../apiClient';

const lessonService = {
    createLesson: async ({ formData }) => {
        return await apiClient.post('/platform/lessons/create/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    updateLesson: async ({ slug, payload }) => {
        // payload can be plain object or FormData (when photo is included)
        const isFormData = payload instanceof FormData;
        return await apiClient.patch(`/platform/lessons/${slug}/update/`, payload, {
            headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
        });
    },

    deleteLesson: async ({ slug }) => {
        return await apiClient.delete(`/platform/lessons/${slug}/delete/`);
    },
};

export default lessonService;
