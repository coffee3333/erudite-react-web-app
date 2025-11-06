import { useCallback, useState } from 'react';
import toast from "react-hot-toast";
import courseService from "../../api/endpoints/courseService.jsx";

const useGetCourseDetail = () => {
    const [course, setCourse] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCourse = useCallback(async (slug) => {
        if (!slug && slug === "") {
            console.log('Slug is undefined or null');
            setError(new Error("Slug is required"));
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const course = await courseService.getCourseDetail({ slug });
            setCourse(course || null);
            setLoading(false);
            return course;
        } catch (error) {
            setLoading(false);
            setError(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { course, loading, getCourse, error };
};

export default useGetCourseDetail;