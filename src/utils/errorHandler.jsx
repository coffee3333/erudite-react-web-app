import toast from 'react-hot-toast';

const errorHandler = {
    '/users/auth/registration/': (error) => {
        if (error.response && error.response.status === 400) {
            const { data } = error.response;
            const messages = [];

            if (data?.email) messages.push(`Email: ${data.email.join(', ')}`);
            if (data?.username) messages.push(`Username: ${data.username.join(', ')}`);
            if (data?.password) messages.push(`Password: ${data.password.join(', ')}`);
            if (data?.non_field_errors) messages.push(data.non_field_errors.join(', '));

            if (messages.length > 0) {
                toast.error(messages.join(' | '));
            } else {
                toast.error('Registration failed. Please check your input.');
            }
            return true;
        }
        return false;
    },
    '/users/auth/login/': (error) => {
        if (error.response && error.response.status === 400) {
            toast.error('Invalid email or password.');
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