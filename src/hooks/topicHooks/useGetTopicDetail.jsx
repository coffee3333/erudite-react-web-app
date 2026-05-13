import { useCallback, useState } from 'react';
import topicService from '../../api/endpoints/topicService.jsx';

const useGetTopicDetail = () => {
    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTopicDetail = useCallback(async ({ slug }) => {
        if (!slug) return;
        setLoading(true);
        setError(null);
        try {
            const res = await topicService.getTopicItems({ slug });
            setTopic(res || null);
            return res;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { topic, loading, error, getTopicDetail };
};

export default useGetTopicDetail;
