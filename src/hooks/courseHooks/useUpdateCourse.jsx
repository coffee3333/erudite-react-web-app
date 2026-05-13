import { useCallback, useState } from 'react';
import toast from "react-hot-toast";
import courseService from "../../api/endpoints/courseService.jsx";

const useUpdateCourse = (slug) => {
    const [loading, setLoading] = useState(false);

    const updateCourse = useCallback(async (courseForm) => {
        setLoading(true);
        try {
            await courseService.updateCourse({ courseForm, slug });
            toast.success("Course edited successfully.");
            return true;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, [slug]);

    return { updateCourse, loading };
};

export default useUpdateCourse;
