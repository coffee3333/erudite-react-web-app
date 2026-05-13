import { useState, useCallback } from 'react';
import challengeService from '../../api/endpoints/challengeService.jsx';

export default function useHintReveal() {
    const [hintLoading, setHintLoading] = useState(false);
    const [revealLoading, setRevealLoading] = useState(false);

    const useHint = useCallback(async ({ slug }) => {
        setHintLoading(true);
        try {
            const res = await challengeService.useHint({ slug });
            return res ?? null;
        } catch {
            return null;
        } finally {
            setHintLoading(false);
        }
    }, []);

    const revealSolution = useCallback(async ({ slug }) => {
        setRevealLoading(true);
        try {
            const res = await challengeService.revealSolution({ slug });
            return res ?? null;
        } catch {
            return null;
        } finally {
            setRevealLoading(false);
        }
    }, []);

    return { useHint, revealSolution, hintLoading, revealLoading };
}
