import {useCallback, useState} from 'react';
import courseService from "../../api/endpoints/courseService.jsx";
import toast from "react-hot-toast";

const useCreatePost = () => {
    const [loading, setLoading] = useState(false);

    const createCourse = useCallback(async (courseForm) => {
        setLoading(true);

        try {
            const response =  await courseService.createCourse({ courseForm });
            await new Promise(res => setTimeout(res,  1000));

            if (response?.slug) {
                toast.success("Post created successfully.");
                setLoading(false);
                return response.slug;
            }
            throw response;
        } catch (error) {
            console.error(error);
            return null;
        }
    }, []);

    return { createCourse, loading };
};

export default useCreatePost;