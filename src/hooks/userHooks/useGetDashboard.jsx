import { useState, useCallback } from 'react';
import userService from '../../api/endpoints/userService.jsx';

const useGetDashboard = () => {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getDashboard();
            setDashboard(data);
            return data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { dashboard, loading, error, getDashboard };
};

export default useGetDashboard;
