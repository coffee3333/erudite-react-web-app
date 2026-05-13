import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import lessonService from '../../api/endpoints/lessonService.jsx';

const useDeleteLesson = () => {
    const [loading, setLoading] = useState(false);

    const deleteLesson = useCallback(async ({ slug }) => {
        setLoading(true);
        try {
            await lessonService.deleteLesson({ slug });
            toast.success('Lesson deleted.');
            return true;
        } catch {
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteLesson, loading };
};

export default useDeleteLesson;
