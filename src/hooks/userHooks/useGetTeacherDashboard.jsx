import { useCallback, useState } from 'react';
import userService from '../../api/endpoints/userService.jsx';

const useGetTeacherDashboard = () => {
    const [teacherDashboard, setTeacherDashboard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTeacherDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getTeacherDashboard();
            setTeacherDashboard(data);
            return data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { teacherDashboard, loading, error, getTeacherDashboard };
};

export default useGetTeacherDashboard;
