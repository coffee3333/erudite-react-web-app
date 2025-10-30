import apiClient from '../apiClient';

const courseService = {

    getCourseDetail: async ( { slug } ) => {
        try {
            return await apiClient.get(`/platform/courses/${slug}/`,{
                requiresAuth: false
            });
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
        console.log("in service");

        // eslint-disable-next-line no-useless-catch
        try {
            console.log("params: " + params);
            return await apiClient.get(`/platform/courses/`,{
                params: params,
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

export default courseService;