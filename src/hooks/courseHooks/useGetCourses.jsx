import { useCallback, useState } from 'react';
import toast from "react-hot-toast";
import courseService from "../../api/endpoints/courseService.jsx";

const useGetCourses = () => {
    const [courses, setCourses] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback(async (form) => {
        if (!form) {
            console.log('Form is undefined or null');
            return;
        }
        setLoading(true);
        console.log('Form contents:', form); // Log the form object
        try {
            const res = await courseService.getCourses({ courseForm: form });
            setCourses(res.results || []);
            setTotalCount(res.count || 0);
        } catch (error) {
            toast.error("Failed to fetch courses");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { courses, totalCount, loading, fetchCourses: fetchPosts };
};

export default useGetCourses;