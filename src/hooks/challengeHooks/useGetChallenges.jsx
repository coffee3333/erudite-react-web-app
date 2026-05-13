import { useCallback, useState } from 'react';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useGetChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getChallengesViaTopic = useCallback(async ({ slug_topic }) => {
        if (!slug_topic) {
            setError(new Error('Slug is required'));
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await challengeService.getChallengesViaTopic({ slug_topic });
            setChallenges(res || []);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { challenges, loading, error, getChallengesViaTopic };
};

export default useGetChallenges;
