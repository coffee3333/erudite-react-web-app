import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../../stores/authStore.jsx';
import HeroResumeCard from './HeroResumeCard.jsx';

const CYCLING_WORDS = ['Exams', 'Skills', 'Concepts', 'Coding', 'Math'];

export default function Hero() {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const [wordIndex, setWordIndex] = useState(0);
    const [visible,   setVisible]   = useState(true);
    const prefersReducedMotion = useRef(
        typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ).current;

    useEffect(() => {
        if (prefersReducedMotion) return;
        const id = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setWordIndex(i => (i + 1) % CYCLING_WORDS.length);
                setVisible(true);
            }, 350);
        }, 2200);
        return () => clearInterval(id);
    }, [prefersReducedMotion]);

    return (
        <Box sx={{ width: '100%', pb: { xs: 3, sm: 5 }, pt: { xs: 4, sm: 6 } }}>
            <Container
                sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    pt: { xs: 10, sm: 14 }, pb: { xs: 6, sm: 8 },
                    position: 'relative', zIndex: 1,
                }}
            >
                {isLoggedIn ? (
                    /* ── Logged-in: launchpad layout ── */
                    <Stack spacing={4} sx={{ alignItems: 'center', width: { xs: '100%', sm: '95%', md: '900px' } }}>

                        {/* Badge */}
                        <Box
                            role="img"
                            aria-label="Interactive Learning Platform"
                            sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                px: 1.5, py: 0.6, borderRadius: '20px',
                                background: 'rgba(108,142,255,0.1)',
                                border: '1px solid rgba(108,142,255,0.2)',
                                animation: prefersReducedMotion ? 'none' : 'fadeSlideDown 0.6s ease both',
                                '@keyframes fadeSlideDown': {
                                    from: { opacity: 0, transform: 'translateY(-12px)' },
                                    to:   { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}>
                            <AutoAwesomeIcon aria-hidden="true" sx={{ fontSize: '0.8rem', color: 'primary.light' }} />
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'primary.light', letterSpacing: '0.04em' }}>
                                Interactive Learning Platform
                            </Typography>
                        </Box>

                        {/* Headline with cycling word */}
                        <Typography
                            component="h1"
                            variant="h1"
                            sx={{
                                textAlign: 'center',
                                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
                                animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.1s both',
                                '@keyframes fadeSlideUp': {
                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                    to:   { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            Ace Your{' '}
                            <Box
                                component="span"
                                aria-live="polite"
                                aria-atomic="true"
                                sx={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    transition: prefersReducedMotion ? 'none' : 'opacity 0.35s ease, transform 0.35s ease',
                                    opacity:   visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                                    minWidth: '3ch',
                                }}>
                                {CYCLING_WORDS[wordIndex]}
                            </Box>
                        </Typography>

                        {/* Resume card — full width, centered */}
                        <Box sx={{ width: '100%', animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.2s both' }}>
                            <HeroResumeCard />
                        </Box>

                        {/* Action buttons — centered row below card */}
                        <Box sx={{
                            display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center',
                            animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.3s both',
                        }}>
                            <Button
                                variant="contained" color="primary" size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/courses')}
                                sx={{ px: 3.5, borderRadius: 2, fontWeight: 700, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                            >
                                Browse courses
                            </Button>
                            <Button
                                variant="outlined" size="large"
                                onClick={() => navigate('/my-profile')}
                                sx={{
                                    px: 3.5, borderRadius: 2, fontWeight: 600,
                                    borderColor: 'rgba(108,142,255,0.3)', color: 'primary.light',
                                    transition: 'transform 0.2s',
                                    '&:hover': { borderColor: 'primary.main', background: 'rgba(108,142,255,0.08)', transform: 'translateY(-2px)' },
                                }}
                            >
                                My profile
                            </Button>
                        </Box>
                    </Stack>
                ) : (
                    /* ── Logged-out: marketing landing layout ── */
                    <Stack spacing={3} sx={{ alignItems: 'center', width: { xs: '100%', sm: '80%', md: '65%' } }}>

                        {/* Badge */}
                        <Box
                            role="img"
                            aria-label="Interactive Learning Platform"
                            sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                                px: 1.5, py: 0.6, borderRadius: '20px',
                                background: 'rgba(108,142,255,0.1)',
                                border: '1px solid rgba(108,142,255,0.2)',
                                animation: prefersReducedMotion ? 'none' : 'fadeSlideDown 0.6s ease both',
                                '@keyframes fadeSlideDown': {
                                    from: { opacity: 0, transform: 'translateY(-12px)' },
                                    to:   { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}>
                            <AutoAwesomeIcon aria-hidden="true" sx={{ fontSize: '0.8rem', color: 'primary.light' }} />
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: 'primary.light', letterSpacing: '0.04em' }}>
                                Interactive Learning Platform
                            </Typography>
                        </Box>

                        {/* Headline with cycling word */}
                        <Typography
                            component="h1"
                            variant="h1"
                            sx={{
                                textAlign: 'center',
                                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                                fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1,
                                animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.1s both',
                                '@keyframes fadeSlideUp': {
                                    from: { opacity: 0, transform: 'translateY(20px)' },
                                    to:   { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            Ace Your{' '}
                            <Box
                                component="span"
                                aria-live="polite"
                                aria-atomic="true"
                                sx={{
                                    display: 'inline-block',
                                    background: 'linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    transition: prefersReducedMotion ? 'none' : 'opacity 0.35s ease, transform 0.35s ease',
                                    opacity:   visible ? 1 : 0,
                                    transform: visible ? 'translateY(0)' : 'translateY(8px)',
                                    minWidth: '3ch',
                                }}>
                                {CYCLING_WORDS[wordIndex]}
                            </Box>
                        </Typography>

                        {/* Subtitle */}
                        <Typography sx={{
                            textAlign: 'center', color: 'text.secondary',
                            fontSize: '1.05rem', lineHeight: 1.7, maxWidth: '520px',
                            animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.2s both',
                        }}>
                            Engage with interactive challenges, track your progress, and grow through real-world practice.
                        </Typography>

                        {/* CTA buttons */}
                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center', pt: 1, animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.3s both' }}>
                            <Button
                                variant="contained" color="primary" size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/courses')}
                                sx={{ px: 3.5, borderRadius: 2, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}
                            >
                                Browse courses
                            </Button>
                            <Button
                                variant="outlined" size="large"
                                onClick={() => navigate('/sign-up')}
                                sx={{
                                    px: 3.5, borderRadius: 2,
                                    borderColor: 'rgba(108,142,255,0.3)', color: 'primary.light',
                                    transition: 'transform 0.2s',
                                    '&:hover': { borderColor: 'primary.main', background: 'rgba(108,142,255,0.08)', transform: 'translateY(-2px)' },
                                }}
                            >
                                Get started free
                            </Button>
                        </Box>

                        {/* Stats row */}
                        <Box sx={{
                            display: 'flex', gap: { xs: 3, sm: 6 }, mt: { xs: 4, sm: 6 },
                            flexWrap: 'wrap', justifyContent: 'center',
                            animation: prefersReducedMotion ? 'none' : 'fadeSlideUp 0.7s ease 0.45s both',
                        }}>
                            {[
                                { value: '3',    label: 'Challenge types' },
                                { value: '100%', label: 'Free to start' },
                                { value: '∞',    label: 'Practice attempts' },
                            ].map(({ value, label }) => (
                                <Box key={label} sx={{ textAlign: 'center' }}>
                                    <Typography sx={{
                                        fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em',
                                        background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                    }}>
                                        {value}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                        {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Stack>
                )}
            </Container>
        </Box>
    );
}
