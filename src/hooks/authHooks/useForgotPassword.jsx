import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import userService from '../../api/endpoints/userService.jsx';

const useForgotPassword = () => {
    const [requesting, setRequesting] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [codeSent, setCodeSent] = useState(false);

    const requestReset = useCallback(async (email) => {
        setRequesting(true);
        try {
            await userService.requestPasswordReset({ email });
            setCodeSent(true);
            toast.success('Reset code sent to your email.');
            return true;
        } catch (err) {
            const detail = err?.response?.data?.error || err?.response?.data?.detail || 'Failed to send code.';
            toast.error(detail);
            return false;
        } finally {
            setRequesting(false);
        }
    }, []);

    const confirmReset = useCallback(async ({ email, otp_code, new_password }) => {
        setConfirming(true);
        try {
            await userService.confirmPasswordReset({ email, otp_code, new_password });
            toast.success('Password changed successfully! You can now sign in.');
            return true;
        } catch (err) {
            const detail = err?.response?.data?.error || err?.response?.data?.detail || 'Invalid or expired code.';
            toast.error(detail);
            return false;
        } finally {
            setConfirming(false);
        }
    }, []);

    return { requesting, confirming, codeSent, requestReset, confirmReset };
};

export default useForgotPassword;
