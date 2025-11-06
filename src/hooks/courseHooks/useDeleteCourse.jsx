import { useCallback, useState } from 'react';
import courseService from "../../api/endpoints/courseService.jsx";

const useDeleteCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCourse = useCallback(async ({ slug }) => {
        if (!slug && slug === "") {
            console.log('Slug is undefined or null');
            setError(new Error("Slug is required"));
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            await courseService.deleteCourse({ slug });
            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            setError(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, deleteCourse };
};

export default useDeleteCourse;