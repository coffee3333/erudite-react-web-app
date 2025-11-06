import { useCallback, useState } from 'react';
import topicService from "../../api/endpoints/topicService.jsx";

const useGetCourseTopics = () => {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTopics = useCallback(async (slug) => {
        console.log(slug);
        if (!slug && slug === "") {
            console.log('Slug is undefined or null');
            setError(new Error("Slug is required"));
            return null;
        }
        setLoading(true);
        setError(null);
        try {
            const topics = await topicService.getCourseTopics({ slug });
            console.log("topics" + topics);
            setTopics(topics || null);
            setLoading(false);
            return topics;
        } catch (error) {
            setLoading(false);
            setError(error);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    return { topics, loading, error, getTopics };
};

export default useGetCourseTopics;