import { useCallback, useState } from 'react';
import courseService from "../../api/endpoints/courseService.jsx";

const useGetCourseDetail = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCourse = useCallback(async (slug) => {
        if (!slug || slug === "") {
            setError(new Error("Slug is required"));
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await courseService.getCourseDetail({ slug });
            setCourse(data || null);
            return data;
        } catch (err) {
            setError(err);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { course, loading, getCourse, error };
};

export default useGetCourseDetail;
