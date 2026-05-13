import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useCreateChallenge = () => {
    const [loading, setLoading] = useState(false);

    const createChallenge = useCallback(async ({ formData }) => {
        setLoading(true);
        try {
            const res = await challengeService.createChallenge({ formData });
            toast.success('Challenge created successfully.');
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createCodeChallenge = useCallback(async ({ payload }) => {
        setLoading(true);
        try {
            const res = await challengeService.createCodeChallenge({ payload });
            toast.success('Code challenge created successfully.');
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createChallenge, createCodeChallenge, loading };
};

export default useCreateChallenge;
