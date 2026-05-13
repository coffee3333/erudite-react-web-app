import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import lessonService from '../../api/endpoints/lessonService.jsx';

const useCreateLesson = () => {
    const [loading, setLoading] = useState(false);

    const createLesson = useCallback(async ({ topicSlug, title, content, videoUrl, contentType, sortOrder, estimatedMinutes, photo }) => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('topic_slug', topicSlug);
            fd.append('title', title);
            if (content)           fd.append('content', content);
            if (videoUrl)          fd.append('video_url', videoUrl);
            if (contentType)       fd.append('content_type', contentType);
            if (sortOrder != null) fd.append('sort_order', sortOrder);
            if (estimatedMinutes)  fd.append('estimated_minutes', estimatedMinutes);
            if (photo)             fd.append('photo', photo);
            const res = await lessonService.createLesson({ formData: fd });
            toast.success('Lesson created.');
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createLesson, loading };
};

export default useCreateLesson;
