import { useCallback, useState } from 'react';
import challengeService from '../../api/endpoints/challengeService.jsx';

const useRunCode = () => {
    const [loading, setLoading] = useState(false);
    const [runResult, setRunResult] = useState(null);

    const runCode = useCallback(async ({ slug_challenge, payload }) => {
        setLoading(true);
        setRunResult(null);
        try {
            const res = await challengeService.runCode({ slug_challenge, payload });
            setRunResult(res);
            return res;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearRunResult = useCallback(() => setRunResult(null), []);

    return { runCode, loading, runResult, clearRunResult };
};

export default useRunCode;
