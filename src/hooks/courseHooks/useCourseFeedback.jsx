import { useState, useCallback } from 'react';
import courseService from '../../api/endpoints/courseService.jsx';

export default function useCourseFeedback() {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchFeedback = useCallback(async (slug) => {
        setLoading(true);
        try {
            const res = await courseService.getFeedback({ slug });
            setFeedback(Array.isArray(res) ? res : []);
        } catch {
            setFeedback([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const submitFeedback = useCallback(async ({ slug, rating, comment }) => {
        setSubmitting(true);
        try {
            const res = await courseService.submitFeedback({ slug, rating, comment });
            setFeedback(prev => [res, ...prev]);
            return res;
        } finally {
            setSubmitting(false);
        }
    }, []);

    const updateFeedback = useCallback(async ({ slug, rating, comment }) => {
        setSubmitting(true);
        try {
            const res = await courseService.updateFeedback({ slug, rating, comment });
            setFeedback(prev => prev.map(f => f.is_own ? res : f));
            return res;
        } finally {
            setSubmitting(false);
        }
    }, []);

    const deleteFeedback = useCallback(async ({ slug }) => {
        setSubmitting(true);
        try {
            await courseService.deleteFeedback({ slug });
            setFeedback(prev => prev.filter(f => !f.is_own));
        } finally {
            setSubmitting(false);
        }
    }, []);

    return { feedback, loading, submitting, fetchFeedback, submitFeedback, updateFeedback, deleteFeedback };
}
