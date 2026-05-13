import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useDeleteChallenge = () => {
    const [loading, setLoading] = useState(false);

    const deleteChallenge = useCallback(async ({ slug }) => {
        setLoading(true);
        try {
            await challengeService.deleteChallenge({ slug });
            toast.success('Challenge deleted.');
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteChallenge, loading };
};

export default useDeleteChallenge;
