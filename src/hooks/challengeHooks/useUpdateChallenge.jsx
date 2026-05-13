import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useUpdateChallenge = () => {
    const [loading, setLoading] = useState(false);

    const updateChallenge = useCallback(async ({ slug, formData }) => {
        setLoading(true);
        try {
            const res = await challengeService.updateChallenge({ slug, formData });
            toast.success('Challenge updated.');
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateChallenge, loading };
};

export default useUpdateChallenge;
