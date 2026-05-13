import { useCallback, useState } from 'react';
import courseService from "../../api/endpoints/courseService.jsx";

const useGetCourses = () => {
    const [courses, setCourses] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCourses = useCallback(async (form) => {
        if (!form) return;
        setLoading(true);
        try {
            const res = await courseService.getCourses({ courseForm: form });
            setCourses(res.results || []);
            setTotalCount(res.count || 0);
        } catch {
            // interceptor handles the toast
        } finally {
            setLoading(false);
        }
    }, []);

    return { courses, totalCount, loading, fetchCourses };
};

export default useGetCourses;
