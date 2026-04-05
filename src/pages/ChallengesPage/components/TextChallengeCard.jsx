// TextChallengeCard.jsx
import * as React from 'react';
import { useState } from 'react';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import useSubmitChallenge from '../../../hooks/challengeHooks/useSubmitChallenge.jsx';
import useAuthStore from '../../../stores/authStore.jsx';
import { useNavigate } from 'react-router-dom';
import HintSolutionBar from './HintSolutionBar.jsx';

export default function TextChallengeCard({ challenge, isPassed, onPassed }) {
    const [answer, setAnswer] = useState('');
    const [wrongAnswer, setWrongAnswer] = useState(false);
    const [hintUsed, setHintUsed] = useState(challenge.user_hint_used || false);
    const [solutionRevealed, setSolutionRevealed] = useState(challenge.user_solution_revealed || false);
    const { submitAnswer, loading } = useSubmitChallenge();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const user = useAuthStore((s) => s.user);
    const emailVerified = user?.email_verified === true;
    const navigate = useNavigate();

    if (isPassed) {
        return (
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ py: 0.5, borderRadius: 1.5 }}>
                Completed — great job!
            </Alert>
        );
    }

    if (isLoggedIn && !emailVerified) {
        return (
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 1.5, px: 1.5, py: 1.25, borderRadius: 1.5,
                border: '1px solid rgba(255,183,77,0.3)',
                background: 'rgba(255,183,77,0.06)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedOutlinedIcon sx={{ fontSize: '1rem', color: '#FFD080', flexShrink: 0 }} />
                    <Box component="span" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                        Verify your email to submit answers.
                    </Box>
                </Box>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate('/my-profile')}
                    sx={{
                        flexShrink: 0, fontSize: '0.75rem',
                        borderColor: 'rgba(255,183,77,0.4)', color: '#FFD080',
                        '&:hover': { borderColor: '#FFD080', background: 'rgba(255,183,77,0.08)' },
                    }}
                >
                    Verify now
                </Button>
            </Box>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;
        setWrongAnswer(false);
        const res = await submitAnswer({
            slug_challenge: challenge.slug,
            payload: { answer: answer.trim(), hint_used: hintUsed },
        });
        if (res?.correct === true) {
            onPassed(challenge.id);
        } else if (res?.correct === false) {
            setWrongAnswer(true);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {wrongAnswer && (
                <Alert severity="error" sx={{ py: 0.5, borderRadius: 1.5 }}>
                    Incorrect. Try a different answer.
                </Alert>
            )}

            {!solutionRevealed && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box
                        component="input"
                        type="text"
                        placeholder="Type your answer…"
                        aria-label="Your answer"
                        value={answer}
                        onChange={(e) => { setAnswer(e.target.value); setWrongAnswer(false); }}
                        disabled={loading}
                        sx={{
                            flex: 1,
                            px: 1.5, py: 1,
                            fontSize: '0.88rem',
                            color: '#E8EAFF',
                            background: 'rgba(108,142,255,0.06)',
                            border: '1px solid',
                            borderColor: wrongAnswer ? 'rgba(244,67,54,0.4)' : 'rgba(108,142,255,0.2)',
                            borderRadius: '8px',
                            outline: 'none',
                            transition: 'border-color 0.2s, background 0.2s',
                            '&:focus': {
                                borderColor: 'rgba(108,142,255,0.6)',
                                background: 'rgba(108,142,255,0.1)',
                            },
                            '&::placeholder': { color: 'rgba(255,255,255,0.25)' },
                            '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
                        }}
                    />
                    <Button
                        type={isLoggedIn ? 'submit' : 'button'}
                        variant="contained"
                        size="small"
                        disabled={isLoggedIn && (!answer.trim() || loading)}
                        onClick={!isLoggedIn ? () => navigate('/sign-in') : undefined}
                        endIcon={loading ? <CircularProgress size={13} color="inherit" /> : <SendIcon sx={{ fontSize: '0.85rem !important' }} />}
                        sx={{ borderRadius: 1.5, px: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        {isLoggedIn ? 'Submit' : 'Sign in'}
                    </Button>
                </Box>
            )}

            <HintSolutionBar
                challenge={challenge}
                onHintUsed={() => setHintUsed(true)}
                onSolutionRevealed={() => setSolutionRevealed(true)}
                isLoggedIn={isLoggedIn}
            />
        </Box>
    );
}
