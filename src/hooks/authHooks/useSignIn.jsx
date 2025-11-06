import { useCallback } from 'react';
import authService from '../../api/endpoints/authService.jsx';
import useAuthStore from "../../stores/authStore.jsx";
import toast from "react-hot-toast";

const useSignIn = () => {
    const { error, isLoading } = useAuthStore();

    const signIn = useCallback(async (credentials) => {
        await authService.login(credentials);
        if (error) {
            toast.error(error.message);
        }
        toast.success('Successfully logged in!');
    }, []);

    return { signIn, error, isLoading };
};

export default useSignIn;