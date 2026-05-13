import { useCallback, useState } from 'react';
import authService from '../../api/endpoints/authService.jsx';
import toast from "react-hot-toast";

const useSignIn = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [serverErrorMsg, setServerErrorMsg] = useState(null);

    const signIn = useCallback(async (credentials) => {
        setIsLoading(true);
        setServerErrorMsg(null);
        try {
            await authService.login(credentials);
            toast.success('Successfully logged in!');
        } catch (err) {
            const msg = err?.response?.data?.error
                || err?.response?.data?.detail
                || 'Invalid credentials.';
            setServerErrorMsg(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { signIn, serverErrorMsg, isLoading };
};

export default useSignIn;
