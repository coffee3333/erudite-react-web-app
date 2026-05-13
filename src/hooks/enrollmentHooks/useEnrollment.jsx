import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import courseService from '../../api/endpoints/courseService.jsx';

const useEnrollment = (slug) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await courseService.getEnrolledStudents({ slug });
            setStudents(Array.isArray(data) ? data : []);
        } catch {
            setStudents([]);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    const enrollStudent = useCallback(async (username) => {
        setEnrollLoading(true);
        try {
            const enrollment = await courseService.enrollStudent({ slug, username });
            setStudents((prev) => [...prev, enrollment]);
            toast.success(`${username} enrolled successfully.`);
            return true;
        } catch (err) {
            const detail = err?.response?.data?.detail || 'Failed to enroll student.';
            toast.error(detail);
            return false;
        } finally {
            setEnrollLoading(false);
        }
    }, [slug]);

    const removeStudent = useCallback(async (username) => {
        try {
            await courseService.removeStudent({ slug, username });
            setStudents((prev) => prev.filter((s) => s.username !== username));
            toast.success(`${username} removed.`);
        } catch (err) {
            const detail = err?.response?.data?.detail || 'Failed to remove student.';
            toast.error(detail);
        }
    }, [slug]);

    return { students, loading, enrollLoading, fetchStudents, enrollStudent, removeStudent };
};

export default useEnrollment;
