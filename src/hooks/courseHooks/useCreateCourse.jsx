import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import courseService from "../../api/endpoints/courseService.jsx";

const useCreateCourse = () => {
    const [loading, setLoading] = useState(false);

    const createCourse = useCallback(async (courseForm) => {
        setLoading(true);
        try {
            const response = await courseService.createCourse({ courseForm });
            if (response?.slug) {
                toast.success("Course created successfully.");
                return response.slug;
            }
            return null;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createCourse, loading };
};

export default useCreateCourse;
