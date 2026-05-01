import apiClient from '../apiClient';

const courseService = {

    getCourseDetail: async ( { slug } ) => {
        try {
            return await apiClient.get(`/platform/courses/${slug}/`);
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    createCourse: async ( { courseForm } ) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.post(`/platform/courses/create/`, courseForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (err) {
            console.log(err.response?.data);
            throw err;
        }
    },

    updateCourse: async ( { courseForm, slug } ) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.patch(`/platform/courses/${slug}/update/`, courseForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    deleteCourse: async ( { slug } ) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.delete(`/platform/courses/${slug}/delete/`);
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    getCourses: async ({ courseForm } ) => {
        const params = {
            page: courseForm.page || 1,
            search: courseForm.search || '',
            sort_by: courseForm.sort_by || 'newest',
            ...(courseForm.category_id != null && courseForm.category_id !== '' && { category_id: courseForm.category_id }),
        };

        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.get(`/platform/courses/`, { params });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    getCertificate: async ({ slug }) => {
        return await apiClient.get(`/platform/courses/${slug}/certificate/`);
    },

    downloadCertificate: async ({ slug }) => {
        return await apiClient.get(`/platform/courses/${slug}/certificate/download/`, {
            responseType: 'blob',
        });
    },

    getEnrolledStudents: async ({ slug }) => apiClient.get(`/platform/courses/${slug}/students/`),

    enrollStudent: async ({ slug, username }) => apiClient.post(`/platform/courses/${slug}/students/`, { username }),

    removeStudent: async ({ slug, username }) => apiClient.delete(`/platform/courses/${slug}/students/${username}/`),

    toggleBookmark: async ({ slug }) => apiClient.post(`/platform/courses/${slug}/bookmark/`),

    getBookmarkedCourses: async () => apiClient.get('/platform/courses/bookmarked/'),

    getFeedback: async ({ slug }) => apiClient.get(`/platform/courses/${slug}/feedback/`),
    submitFeedback: async ({ slug, rating, comment }) => apiClient.post(`/platform/courses/${slug}/feedback/submit/`, { rating, comment }),
    updateFeedback: async ({ slug, rating, comment }) => apiClient.patch(`/platform/courses/${slug}/feedback/mine/`, { rating, comment }),
    deleteFeedback: async ({ slug }) => apiClient.delete(`/platform/courses/${slug}/feedback/delete/`),
};

export default courseService;