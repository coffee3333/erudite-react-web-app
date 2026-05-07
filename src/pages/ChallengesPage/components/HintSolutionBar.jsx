// HintSolutionBar.jsx
// Shared UI for hint and solution reveal, used by all challenge card types
import * as React from 'react';
import { useState } from 'react';
import {
    Box, Button, CircularProgress, Collapse, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import useHintReveal from '../../../hooks/challengeHooks/useHintReveal.jsx';

/**
 * Props:
 * - challenge: { slug, hint_available, user_hint_used, user_solution_revealed, solution_explanation (owner only) }
 * - onHintUsed: () => void  — called after first hint use (so parent can mark hint_used=true in submit)
 * - onSolutionRevealed: () => void  — called after solution reveal (so parent can block submit)
 * - isLoggedIn: bool
 */
export default function HintSolutionBar({ challenge, onHintUsed, onSolutionRevealed, isLoggedIn }) {
    const { useHint, revealSolution, hintLoading, revealLoading } = useHintReveal();

    const [hintText, setHintText] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [hintUsedLocally, setHintUsedLocally] = useState(challenge.user_hint_used || false);

    const [solutionText, setSolutionText] = useState(null);
    const [solutionRevealedLocally, setSolutionRevealedLocally] = useState(challenge.user_solution_revealed || false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const solutionAvailable = challenge.solution_available;
    const hintAvailable = challenge.hint_available;

    const handleUseHint = async () => {
        if (hintUsedLocally && hintText) {
            setShowHint(v => !v);
            return;
        }
        const data = await useHint({ slug: challenge.slug });
        if (data?.hint) {
            setHintText(data.hint);
            setHintUsedLocally(true);
            setShowHint(true);
            if (!challenge.user_hint_used) onHintUsed?.();
        }
    };

    const handleConfirmReveal = async () => {
        setConfirmOpen(false);
        const data = await revealSolution({ slug: challenge.slug });
        if (data?.solution_explanation) {
            setSolutionText(data.solution_explanation);
            setSolutionRevealedLocally(true);
            onSolutionRevealed?.();
        }
    };

    if (!isLoggedIn) return null;
    if (!hintAvailable && !solutionAvailable) return null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {/* Hint button */}
                {hintAvailable && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={handleUseHint}
                        disabled={hintLoading}
                        startIcon={hintLoading
                            ? <CircularProgress size={12} color="inherit" />
                            : <TipsAndUpdatesIcon sx={{ fontSize: '0.9rem !important' }} />
                        }
                        sx={{
                            fontSize: '0.75rem', borderRadius: 1.5, px: 1.5,
                            borderColor: hintUsedLocally ? 'rgba(255,183,77,0.4)' : 'rgba(255,183,77,0.25)',
                            color: '#FFD080',
                            background: hintUsedLocally ? 'rgba(255,183,77,0.07)' : 'transparent',
                            '&:hover': { borderColor: 'rgba(255,183,77,0.6)', background: 'rgba(255,183,77,0.1)' },
                        }}
                    >
                        {hintUsedLocally ? (showHint ? 'Hide hint' : 'Show hint') : 'Use hint (−50% pts)'}
                    </Button>
                )}

                {/* Reveal solution button */}
                {solutionAvailable && !solutionRevealedLocally && (
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={() => setConfirmOpen(true)}
                        disabled={revealLoading}
                        startIcon={revealLoading
                            ? <CircularProgress size={12} color="inherit" />
                            : <LockOpenIcon sx={{ fontSize: '0.9rem !important' }} />
                        }
                        sx={{
                            fontSize: '0.75rem', borderRadius: 1.5, px: 1.5,
                            borderColor: 'rgba(176,110,255,0.3)', color: 'secondary.light',
                            '&:hover': { borderColor: 'rgba(176,110,255,0.6)', background: 'rgba(176,110,255,0.08)' },
                        }}
                    >
                        Reveal solution
                    </Button>
                )}

                {/* Already-revealed state */}
                {solutionRevealedLocally && (
                    <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 0.75,
                        px: 1.25, py: 0.4, borderRadius: 1.5,
                        border: '1px solid rgba(244,67,54,0.25)',
                        background: 'rgba(244,67,54,0.06)',
                    }}>
                        <LockOpenIcon sx={{ fontSize: '0.8rem', color: 'error.light' }} />
                        <Typography sx={{ fontSize: '0.75rem', color: 'error.light' }}>
                            Solution revealed — submission locked
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Hint text */}
            <Collapse in={showHint && !!hintText}>
                <Box sx={{
                    px: 1.5, py: 1, borderRadius: 1.5,
                    border: '1px solid rgba(255,183,77,0.2)',
                    background: 'rgba(255,183,77,0.06)',
                }}>
                    <Typography sx={{ fontSize: '0.82rem', color: '#FFD080', lineHeight: 1.65 }}>
                        {hintText}
                    </Typography>
                </Box>
            </Collapse>

            {/* Solution explanation */}
            {solutionRevealedLocally && solutionText && (
                <Box sx={{
                    px: 1.5, py: 1.25, borderRadius: 1.5,
                    border: '1px solid rgba(176,110,255,0.25)',
                    background: 'rgba(176,110,255,0.06)',
                }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'secondary.light', mb: 0.5 }}>
                        Solution explanation
                    </Typography>
                    <Typography sx={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {solutionText}
                    </Typography>
                </Box>
            )}

            {/* Confirm dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Reveal solution?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Once you reveal the solution you will <strong>no longer be able to submit</strong> this challenge.
                        Your progress will not be counted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} size="small">Cancel</Button>
                    <Button onClick={handleConfirmReveal} variant="contained" color="secondary" size="small">
                        Reveal anyway
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
