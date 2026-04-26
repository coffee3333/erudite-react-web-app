import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import userService from '../../api/endpoints/userService.jsx';
import useAuthStore from '../../stores/authStore.jsx';

const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);

    // Returns { data } on success, or { fieldErrors } on 400, or null on other errors.
    const updateProfile = useCallback(async (formData) => {
        setLoading(true);
        try {
            const data = await userService.updateProfile(formData);
            const existing = useAuthStore.getState().user || {};
            useAuthStore.getState().setUser({ ...existing, ...data });
            toast.success('Profile updated.');
            return { data };
        } catch (err) {
            // 400 with field errors — return them so the form can show inline messages.
            // apiClient already shows a toast, so we don't add another.
            if (err?.response?.status === 400 && err?.response?.data && typeof err.response.data === 'object') {
                const raw = err.response.data;
                const fieldErrors = Object.fromEntries(
                    Object.entries(raw).map(([k, v]) => [k, Array.isArray(v) ? v[0] : String(v)])
                );
                return { fieldErrors };
            }
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, updateProfile };
};

export default useUpdateProfile;
