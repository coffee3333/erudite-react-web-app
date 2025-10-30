import apiClient from '../apiClient';

const topicService = {
    getCourseTopics: async ({ slug } ) => {
        try {
            return await apiClient.get(`/platform/topics/${slug}/`,{
                requiresAuth: false
            });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    createCourseTopics: async ({ postForm } ) => {
        try {
            return await apiClient.post(`/platform/topics/create/`, postForm, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (err) {
            console.log(err.response?.data);
            throw err;
        }
    },

    updateCourseTopic: async ( { formTopic , slug } ) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.patch(`/platform/topics/${slug}/update/`,  formTopic, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },

    deleteCourseTopic: async ({ slug_topic }) => {
        // eslint-disable-next-line no-useless-catch
        try {
            return await apiClient.delete(`/platform/topics/${slug_topic}/delete/`);
        } catch (err) {
            console.log(err.response);
            throw err;
        }
    },
};

export default topicService;