// QuizChallengeCard.jsx
import * as React from 'react';
import { useState } from 'react';
import { Box, RadioGroup, FormControlLabel, Radio, Button, CircularProgress, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import useSubmitChallenge from '../../../hooks/challengeHooks/useSubmitChallenge.jsx';
import useAuthStore from '../../../stores/authStore.jsx';
import { useNavigate } from 'react-router-dom';
import HintSolutionBar from './HintSolutionBar.jsx';

export default function QuizChallengeCard({ challenge, isPassed, onPassed }) {
    const [selectedOptionId, setSelectedOptionId] = useState(null);
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
        if (!selectedOptionId) return;
        setWrongAnswer(false);
        const res = await submitAnswer({
            slug_challenge: challenge.slug,
            payload: { option_id: Number(selectedOptionId), hint_used: hintUsed },
        });
        if (res?.correct === true) {
            onPassed(challenge.id);
        } else if (res?.correct === false) {
            setWrongAnswer(true);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <RadioGroup
                value={selectedOptionId ?? ''}
                onChange={(e) => { setSelectedOptionId(e.target.value); setWrongAnswer(false); }}
            >
                {challenge.options.map((opt) => (
                    <FormControlLabel
                        key={opt.id}
                        value={String(opt.id)}
                        control={
                            <Radio
                                size="small"
                                sx={{
                                    color: 'rgba(108,142,255,0.4)',
                                    '&.Mui-checked': { color: 'primary.main' },
                                }}
                            />
                        }
                        label={opt.text}
                        disabled={loading || solutionRevealed}
                        sx={{
                            mx: 0, mb: 0.25, px: 1.5, py: 0.75, borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: String(selectedOptionId) === String(opt.id)
                                ? 'rgba(108,142,255,0.35)'
                                : 'rgba(255,255,255,0.06)',
                            background: String(selectedOptionId) === String(opt.id)
                                ? 'rgba(108,142,255,0.08)'
                                : 'transparent',
                            transition: 'all 0.15s',
                            '&:hover': {
                                borderColor: 'rgba(108,142,255,0.25)',
                                background: 'rgba(108,142,255,0.05)',
                            },
                            '& .MuiFormControlLabel-label': { fontSize: '0.88rem' },
                        }}
                    />
                ))}
            </RadioGroup>

            {wrongAnswer && (
                <Alert severity="error" sx={{ py: 0.5, borderRadius: 1.5 }}>
                    Incorrect. Try another option.
                </Alert>
            )}

            <HintSolutionBar
                challenge={challenge}
                onHintUsed={() => setHintUsed(true)}
                onSolutionRevealed={() => setSolutionRevealed(true)}
                isLoggedIn={isLoggedIn}
            />

            {!solutionRevealed && (
                <Button
                    type={isLoggedIn ? 'submit' : 'button'}
                    variant="contained"
                    size="small"
                    disabled={isLoggedIn && (!selectedOptionId || loading)}
                    onClick={!isLoggedIn ? () => navigate('/sign-in') : undefined}
                    sx={{ mt: 0.5, borderRadius: 1.5, alignSelf: 'flex-start', px: 2.5 }}
                    endIcon={loading ? <CircularProgress size={13} color="inherit" /> : null}
                >
                    {isLoggedIn ? 'Submit answer' : 'Sign in to submit'}
                </Button>
            )}
        </Box>
    );
}
