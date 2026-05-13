import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useSubmitChallenge = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const submitAnswer = useCallback(async ({ slug_challenge, payload }) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await challengeService.submitAnswer({ slug_challenge, payload });
            setResult(res);
            if (res?.correct === true || res?.status === 'accepted') {
                toast.success('Correct! Well done.');
            } else if (res?.correct === false || res?.status === 'wrong_answer') {
                toast.error('Incorrect answer. Try again!');
            }
            return res;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { submitAnswer, loading, result };
};

export default useSubmitChallenge;
