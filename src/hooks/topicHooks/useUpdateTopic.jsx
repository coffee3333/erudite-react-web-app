import {useCallback, useState} from 'react';
import topicService from "../../api/endpoints/topicService.jsx";

const useUpdateTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const updateTopic = useCallback(async ({ slug, title }) => {
        if (!slug && slug === "" && !title && title === "") {
            console.log('Slug and title are undefined or null');
            setError(new Error("Slug and title are required"));
            return null;
        }

        setLoading(true);
        setError(null);
        try {
            const formTopic = new FormData();
            formTopic.append("title", title);

            await topicService.updateCourseTopic({ formTopic, slug });
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

    return { updateTopic, loading, error };
};

export default useUpdateTopic;