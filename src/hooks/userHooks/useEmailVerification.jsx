import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import userService from '../../api/endpoints/userService.jsx';
import apiClient from '../../api/apiClient.jsx';
import useAuthStore from '../../stores/authStore.jsx';

const useEmailVerification = () => {
    const [codeSent, setCodeSent] = useState(false);
    const [requesting, setRequesting] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const setUser = useAuthStore((s) => s.setUser);

    const requestCode = useCallback(async () => {
        setRequesting(true);
        try {
            await userService.requestEmailVerification();
            setCodeSent(true);
            toast.success('Verification code sent to your email.');
        } catch (err) {
            const detail = err?.response?.data?.error || err?.response?.data?.detail || 'Failed to send code.';
            toast.error(detail);
        } finally {
            setRequesting(false);
        }
    }, []);

    const confirmCode = useCallback(async (code) => {
        setConfirming(true);
        try {
            await userService.confirmEmailVerification({ code });
            // Re-fetch fresh profile so email_verified and all fields are up-to-date
            const freshProfile = await apiClient.get('/users/profile/me/');
            setUser(freshProfile);
            toast.success('Email verified successfully!');
            return true;
        } catch (err) {
            const detail = err?.response?.data?.error || err?.response?.data?.detail || 'Invalid or expired code.';
            toast.error(detail);
            return false;
        } finally {
            setConfirming(false);
        }
    }, [setUser]);

    return { codeSent, requesting, confirming, requestCode, confirmCode };
};

export default useEmailVerification;
