import toast from 'react-hot-toast';

const errorHandler = {
    '/users/auth/registration/': (error) => {
        if (error.response && error.response.status === 400) {
            // Field errors are handled inline by SignUp.jsx — suppress global toast
            return true;
        }
        return false;
    },
    '/users/auth/login/': (error) => {
        if (error.response && error.response.status === 400) {
            // 400 from login means validation error; apiClient generic handler covers it
            return true;
        }
        return false;
    },
    '/users/users/me/update/': (error) => {
        if (error.response && error.response.status === 400) {
            const { data } = error.response;
            if (data?.username) toast.error(data.username);
            return true;
        }
        return false;
    },
    '/users/auth/password/reset/request/': (error) => {
        if (error.response && error.response.status === 404) {
            // toast.error(error.message);
            return true;
        }
        return false;
    },
    '/users/auth/password/reset/confirm/': (error) => {
        if (error.response && error.response.status === 400) {
            // toast.error(error.message);
            return true;
        }
        return false;
    },
    '/blog/posts/:slug/update/': (error) => {
        if (error.response && error.response.status === 400) {
            toast.error(error.message);
            return true;
        }
        return false;
    },
};

export default errorHandler;