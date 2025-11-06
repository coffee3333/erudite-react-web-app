import {useCallback, useState} from 'react';
import toast from "react-hot-toast";
import courseService from "../../api/endpoints/courseService.jsx";

const useUpdateCourse = (slug) => {
    const [loading, setLoading] = useState(false);

    const updateCourse = useCallback(async (courseForm) => {
        setLoading(true);

        try {
            await courseService.updateCourse({ courseForm, slug });
            await new Promise(res => setTimeout(res,  1000));

            toast.success("Course edited successfully.");
            setLoading(false);
            return true;

        } catch (error) {
            toast.error(error?.message || "Unknown error");
            return null;
        }
    }, []);

    return { updateCourse, loading };
};

export default useUpdateCourse;