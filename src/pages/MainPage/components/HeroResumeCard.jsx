import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../stores/authStore.jsx';
import useGetDashboard from '../../../hooks/userHooks/useGetDashboard.jsx';

const STUDENT_QUOTES = [
    "Every challenge you solve is a step closer to mastery.",
    "Consistency beats intensity. Keep showing up.",
    "You're building something great — one lesson at a time.",
    "The best time to learn was yesterday. The second best time is now.",
    "Progress, not perfection. Keep going.",
];

const TEACHER_QUOTES = [
    "Your courses are shaping the next generation of learners.",
    "Great teachers create great futures.",
    "Every lesson you craft makes a difference.",
    "The knowledge you share outlasts any classroom.",
];

function getDailyQuote(quotes) {
    const day = new Date().getDate();
    return quotes[day % quotes.length];
}

export default function HeroResumeCard() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const { dashboard, loading, getDashboard } = useGetDashboard();

    useEffect(() => {
        getDashboard();
    }, [getDashboard]);

    if (loading || !dashboard) {
        return (
            <Box sx={cardSx}>
                <Skeleton width={200} height={28} sx={{ mb: 0.5 }} />
                <Skeleton width="85%" height={18} sx={{ mb: 1.5 }} />
                <Skeleton width="100%" height={8} sx={{ borderRadius: 1, mb: 1.5 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton width={120} height={18} />
                    <Skeleton width={140} height={18} />
                </Box>
            </Box>
        );
    }

    const { stats, courses, recent_activity } = dashboard;
    const isTeacher = user?.role === 'teacher';
    const quote = getDailyQuote(isTeacher ? TEACHER_QUOTES : STUDENT_QUOTES);

    const activeCourses = courses.filter(c => c.completion_pct > 0 && c.completion_pct < 100);
    const avgProgress = activeCourses.length
        ? Math.round(activeCourses.reduce((sum, c) => sum + c.completion_pct, 0) / activeCourses.length)
        : 0;
    const resumeCourse = activeCourses[0];

    const latestActivity = recent_activity?.[0];
    const continueUrl = latestActivity?.topic_slug
        ? `/challenges/${latestActivity.topic_slug}`
        : resumeCourse?.slug
            ? `/courses/${resumeCourse.slug}`
            : '/courses';

    return (
        <Box sx={cardSx}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <LocalFireDepartmentIcon sx={{ fontSize: '1.2rem', color: '#FF8C42', flexShrink: 0 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', color: 'text.primary', lineHeight: 1.3 }}>
                            Welcome back,{' '}
                            <Box
                                component="span"
                                onClick={() => navigate('/my-profile')}
                                sx={{
                                    background: 'linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    '&::after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -1, left: 0, right: 0,
                                        height: '1.5px',
                                        background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                                        transform: 'scaleX(0)',
                                        transformOrigin: 'left',
                                        transition: 'transform 0.25s ease',
                                    },
                                    '&:hover::after': { transform: 'scaleX(1)' },
                                    '&:hover': { opacity: 0.85 },
                                    transition: 'opacity 0.2s',
                                }}
                            >
                                {user?.username}
                            </Box>
                        </Typography>
                    </Box>
                    <Typography sx={{ color: 'text.secondary', fontStyle: 'italic', lineHeight: 1.6, fontSize: '0.875rem' }}>
                        "{quote}"
                    </Typography>
                </Box>
                <Button
                    size="small"
                    endIcon={<ArrowForwardIcon sx={{ fontSize: '0.9rem !important' }} />}
                    onClick={() => navigate(continueUrl)}
                    sx={{
                        fontSize: '0.82rem', fontWeight: 600, px: 1.75, py: 0.6,
                        borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0,
                        alignSelf: { xs: 'stretch', sm: 'flex-start' },
                        color: 'primary.light',
                        border: '1px solid rgba(108,142,255,0.3)',
                        '&:hover': {
                            background: 'rgba(108,142,255,0.08)',
                            borderColor: 'primary.main',
                        },
                        transition: 'all 0.2s',
                    }}
                >
                    {latestActivity ? 'Resume where you left off' : 'Start learning'}
                </Button>
            </Box>

            {/* Progress bar — students with active courses */}
            {!isTeacher && activeCourses.length > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, opacity: 0.75 }}>
                            {resumeCourse.title}
                        </Typography>
                        <Typography sx={{
                            fontSize: '0.875rem', fontWeight: 800,
                            background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            {avgProgress}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={avgProgress}
                        aria-label={`Course progress: ${avgProgress}%`}
                        sx={{
                            height: 7, borderRadius: 3,
                            bgcolor: 'rgba(108,142,255,0.12)',
                            '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(90deg, #6C8EFF, #B06EFF)',
                                borderRadius: 3,
                            },
                        }}
                    />
                    {latestActivity && (
                        <Typography sx={{ fontSize: '0.78rem', opacity: 0.45, mt: 0.75, display: 'block' }}>
                            Last activity: {latestActivity.challenge_title} · {latestActivity.course_title}
                        </Typography>
                    )}
                </Box>
            )}

            {/* Stats row */}
            <Box sx={{ display: 'flex', gap: 3.5, flexWrap: 'wrap' }}>
                {isTeacher ? (
                    <>
                        <StatChip icon={<SchoolIcon sx={{ fontSize: '1rem' }} />}
                            label={`${stats.courses_created ?? courses.length} course${(stats.courses_created ?? courses.length) !== 1 ? 's' : ''} created`} />
                        <StatChip icon={<EmojiEventsIcon sx={{ fontSize: '1rem' }} />}
                            label={`${stats.total_students ?? 0} student${(stats.total_students ?? 0) !== 1 ? 's' : ''} enrolled`} />
                    </>
                ) : (
                    <>
                        <StatChip icon={<SchoolIcon sx={{ fontSize: '1rem' }} />}
                            label={`${courses.length} course${courses.length !== 1 ? 's' : ''} enrolled`} />
                        <StatChip icon={<EmojiEventsIcon sx={{ fontSize: '1rem' }} />}
                            label={`${stats.challenges_passed ?? 0} challenge${(stats.challenges_passed ?? 0) !== 1 ? 's' : ''} completed`} />
                    </>
                )}
            </Box>
        </Box>
    );
}

function StatChip({ icon, label }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ color: 'primary.light', opacity: 0.75, display: 'flex' }}>{icon}</Box>
            <Typography sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '0.875rem' }}>
                {label}
            </Typography>
        </Box>
    );
}

const cardSx = {
    display: 'flex', flexDirection: 'column', gap: 2.5,
    px: 3.5, py: 3,
    borderRadius: 2.5,
    border: '1px solid rgba(108,142,255,0.2)',
    background: 'rgba(108,142,255,0.06)',
    backdropFilter: 'blur(12px)',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '&:hover': {
        borderColor: 'rgba(108,142,255,0.35)',
        boxShadow: '0 4px 24px rgba(108,142,255,0.1)',
    },
};
