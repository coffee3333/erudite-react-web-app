import { useState, useCallback } from 'react';
import userService from '../../api/endpoints/userService.jsx';

const useLeaderboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLeaderboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await userService.getLeaderboard();
            setData(res);
            return res;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, getLeaderboard };
};

export default useLeaderboard;
