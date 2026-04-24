import { useCallback, useState } from 'react';
import courseService from '../../api/endpoints/courseService.jsx';

const useGetCertificate = () => {
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);

    // Returns certificate metadata, or null if not earned (404 is silent)
    const getCertificate = useCallback(async ({ slug }) => {
        setLoading(true);
        try {
            const res = await courseService.getCertificate({ slug });
            setCertificate(res);
            return res;
        } catch {
            setCertificate(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Triggers a browser download of the PDF using a temporary <a> element
    const downloadCertificate = useCallback(async ({ slug, courseTitle }) => {
        try {
            const blob = await courseService.downloadCertificate({ slug });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate_${courseTitle || slug}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            // interceptor handles the toast
        }
    }, []);

    return { certificate, loading, getCertificate, downloadCertificate };
};

export default useGetCertificate;
