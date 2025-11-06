import { useCallback, useState } from 'react';
import topicService from "../../api/endpoints/topicService.jsx";

const useCreateTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createTopic = useCallback(async ({ slug, title }) => {
        if (!slug && slug === "" && !title && title === "") {
            console.log('Slug and title are undefined or null');
            setError(new Error("Slug and title are required"));
            return null;
        }

        setLoading(true);
        setError(null);
        try {

            const postForm = new FormData();
            postForm.append("title", title);
            postForm.append("course_slug", slug);

            await topicService.createCourseTopics({ postForm });
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

    return { loading, error, createTopic };
};

export default useCreateTopic;