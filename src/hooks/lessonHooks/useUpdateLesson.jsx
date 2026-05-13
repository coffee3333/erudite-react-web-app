import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import lessonService from '../../api/endpoints/lessonService.jsx';

const useUpdateLesson = () => {
    const [loading, setLoading] = useState(false);

    const updateLesson = useCallback(async ({ slug, payload }) => {
        setLoading(true);
        try {
            const res = await lessonService.updateLesson({ slug, payload });
            toast.success('Lesson saved.');
            return res;
        } catch {
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateLesson, loading };
};

export default useUpdateLesson;
