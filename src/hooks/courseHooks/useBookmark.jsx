import { useState, useCallback, useRef } from 'react';
import courseService from '../../api/endpoints/courseService.jsx';

export default function useBookmark() {
    const [toggling, setToggling] = useState(false);
    const inFlight = useRef(false);

    const toggleBookmark = useCallback(async ({ slug, onToggled }) => {
        if (inFlight.current) return;
        inFlight.current = true;
        setToggling(true);
        try {
            const res = await courseService.toggleBookmark({ slug });
            const bookmarked = res.bookmarked;
            onToggled?.(bookmarked);
            return bookmarked;
        } catch {
            return null;
        } finally {
            inFlight.current = false;
            setToggling(false);
        }
    }, []);

    return { toggling, toggleBookmark };
}
