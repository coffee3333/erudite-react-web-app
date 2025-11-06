import { useCallback, useState } from 'react';
import topicService from "../../api/endpoints/topicService.jsx";

const useDeleteTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteTopic = useCallback(async ({ slug_topic }) => {
        if (!slug_topic && slug_topic === "") {
            console.log('Slug is undefined or null');
            setError(new Error("Slug is required"));
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            await topicService.deleteCourseTopic({ slug_topic });
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

    return { loading, error, deleteTopic };
};

export default useDeleteTopic;