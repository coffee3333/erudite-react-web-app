import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Avatar, Chip, LinearProgress, Skeleton,
    Divider, Tooltip, IconButton, Collapse, Table, TableBody,
    TableCell, TableHead, TableRow, TextField, Button, InputAdornment,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PeopleIcon from '@mui/icons-material/People';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EmailIcon from '@mui/icons-material/Email';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkSavedIcon from '@mui/icons-material/Bookmark';
import { format, parseISO } from 'date-fns';
import MainWrapper from '../../components/layout/MainWrapper.jsx';
import useGetDashboard from '../../hooks/userHooks/useGetDashboard.jsx';
import useGetTeacherDashboard from '../../hooks/userHooks/useGetTeacherDashboard.jsx';
import useAuthStore from '../../stores/authStore.jsx';
import useEmailVerification from '../../hooks/userHooks/useEmailVerification.jsx';
import useUpdateProfile from '../../hooks/userHooks/useUpdateProfile.jsx';
import useForgotPassword from '../../hooks/authHooks/useForgotPassword.jsx';
import courseService from '../../api/endpoints/courseService.jsx';

// ── Email verification banner ─────────────────────────────────────────────────
function EmailVerificationBanner({ email }) {
    const { codeSent, requesting, confirming, requestCode, confirmCode } = useEmailVerification();
    const [code, setCode] = useState('');
    const [verified, setVerified] = useState(false);

    if (verified) return null;

    const handleConfirm = async () => {
        const ok = await confirmCode(code.trim());
        if (ok) setVerified(true);
    };

    return (
        <Box sx={{
            p: 2.5,
            borderRadius: 2,
            border: '1px solid rgba(255,183,77,0.35)',
            background: 'linear-gradient(135deg, rgba(255,183,77,0.08) 0%, rgba(255,152,0,0.04) 100%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <WarningAmberIcon sx={{ color: '#FFD080', fontSize: '1.2rem', flexShrink: 0 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFD080' }}>
                        Email not verified
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.65 }}>
                        Verify your email to unlock all features. A 6-digit code will be sent to{' '}
                        <strong>{email}</strong>.
                    </Typography>
                </Box>
                {!codeSent && (
                    <Button
                        size="small"
                        variant="outlined"
                        disabled={requesting}
                        onClick={() => requestCode()}
                        sx={{
                            flexShrink: 0,
                            borderColor: 'rgba(255,183,77,0.4)',
                            color: '#FFD080',
                            '&:hover': { borderColor: '#FFD080', background: 'rgba(255,183,77,0.08)' },
                        }}
                    >
                        {requesting ? 'Sending…' : 'Send code'}
                    </Button>
                )}
            </Box>

            {codeSent && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        size="small"
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*', 'aria-label': 'Email verification code' }}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                        sx={{ width: 180 }}
                    />
                    <Button
                        size="small"
                        variant="contained"
                        disabled={confirming || code.trim().length !== 6}
                        onClick={handleConfirm}
                        sx={{ background: 'linear-gradient(135deg, #FFB74D, #FF9800)', color: '#000', fontWeight: 700 }}
                    >
                        {confirming ? 'Verifying…' : 'Verify'}
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        disabled={requesting}
                        onClick={() => requestCode()}
                        sx={{ color: 'rgba(255,183,77,0.7)', fontSize: '0.75rem' }}
                    >
                        {requesting ? 'Sending…' : 'Resend code'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, accent }) {
    return (
        <Box sx={{
            flex: '1 1 140px',
            p: 2.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: `${accent}22`,
            background: `linear-gradient(135deg, ${accent}10 0%, transparent 60%)`,
            display: 'flex', flexDirection: 'column', gap: 0.75,
        }}>
            <Box sx={{ color: accent, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {icon}
                <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>
                    {label}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>
                {value}
            </Typography>
        </Box>
    );
}

// ── Activity row ──────────────────────────────────────────────────────────────
function ActivityRow({ item, navigate }) {
    const STATUS_COLOR = { passed: '#81C784', failed: '#EF9A9A', pending: '#FFD080' };
    return (
        <Box
            onClick={() => navigate(`/challenges/${item.topic_slug}`)}
            role="button"
            tabIndex={0}
            aria-label={`${item.challenge_title} — ${item.status}`}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/challenges/${item.topic_slug}`)}
            sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 1.5,
                borderRadius: 1.5, cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { background: 'rgba(108,142,255,0.06)' },
            }}
        >
            <Box sx={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: STATUS_COLOR[item.status] || 'rgba(255,255,255,0.3)',
            }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.challenge_title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                    {item.course_title}
                </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                {item.score > 0 && (
                    <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#6C8EFF' }}>
                        +{Math.round(item.score)} pts
                    </Typography>
                )}
                <Typography variant="caption" sx={{ opacity: 0.4, fontSize: '0.68rem' }}>
                    {format(parseISO(item.created_at), 'MMM d')}
                </Typography>
            </Box>
        </Box>
    );
}

// ── Course progress row ───────────────────────────────────────────────────────
function CourseProgressRow({ course, navigate }) {
    const pct = course.completion_pct;
    const done = pct >= 100;
    return (
        <Box
            onClick={() => navigate(`/course/${course.slug}`)}
            role="button"
            tabIndex={0}
            aria-label={`${course.title} — ${Math.round(pct)}% complete`}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/course/${course.slug}`)}
            sx={{
                display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 1.5,
                borderRadius: 1.5, cursor: 'pointer',
                transition: 'background 0.15s',
                '&:hover': { background: 'rgba(108,142,255,0.06)' },
            }}
        >
            <Box sx={{
                width: 40, height: 40, borderRadius: 1.5, flexShrink: 0, overflow: 'hidden',
                background: 'rgba(108,142,255,0.1)',
                border: '1px solid rgba(108,142,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {course.featured_image
                    ? <img src={course.featured_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <SchoolIcon sx={{ fontSize: '1.1rem', opacity: 0.4 }} />
                }
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {course.title}
                    </Typography>
                    {done && <EmojiEventsIcon sx={{ fontSize: '0.85rem', color: '#FFD080', flexShrink: 0 }} />}
                </Box>
                <LinearProgress
                    variant="determinate"
                    value={pct}
                    aria-label={`Course progress: ${Math.round(pct)}%`}
                    sx={{
                        height: 4,
                        '& .MuiLinearProgress-bar': {
                            background: done
                                ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                                : 'linear-gradient(90deg, #6C8EFF, #B06EFF)',
                        },
                    }}
                />
            </Box>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, opacity: 0.7, flexShrink: 0, minWidth: 36, textAlign: 'right' }}>
                {Math.round(pct)}%
            </Typography>
        </Box>
    );
}

// ── Challenge status dot ──────────────────────────────────────────────────────
function ChallengeDot({ ch }) {
    const color = ch.status === 'passed'
        ? '#81C784'
        : ch.status === 'failed'
        ? '#EF9A9A'
        : 'rgba(255,255,255,0.15)';
    return (
        <Tooltip title={`${ch.title} · ${ch.status.replace('_', ' ')}${ch.score > 0 ? ` · ${ch.score}pts` : ''}`} arrow>
            <Box sx={{
                width: 10, height: 10, borderRadius: '50%',
                background: color,
                border: `1px solid ${ch.status === 'not_attempted' ? 'rgba(255,255,255,0.12)' : color}`,
                flexShrink: 0, cursor: 'default',
            }} />
        </Tooltip>
    );
}

// ── Student row inside a course ───────────────────────────────────────────────
function StudentRow({ student }) {
    const [expanded, setExpanded] = useState(false);
    const pct = student.completion_pct;
    const pctColor = pct >= 80 ? '#81C784' : pct >= 40 ? '#FFD080' : '#EF9A9A';

    return (
        <>
            <TableRow
                onClick={() => setExpanded(v => !v)}
                sx={{
                    cursor: 'pointer',
                    '&:hover td': { background: 'rgba(108,142,255,0.04)' },
                    '& td': { borderColor: 'rgba(255,255,255,0.05)', py: 1.25 },
                }}
            >
                {/* Avatar + name + email */}
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                            src={student.photo}
                            sx={{
                                width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                                border: '1px solid rgba(108,142,255,0.25)',
                            }}
                        >
                            {student.username?.[0]?.toUpperCase()}
                        </Avatar>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                                    {student.username}
                                </Typography>
                                {student.moodle_platform && (
                                    <Chip
                                        icon={<SchoolIcon sx={{ fontSize: '0.7rem !important' }} />}
                                        label={student.moodle_platform}
                                        size="small"
                                        sx={{
                                            height: 18, fontSize: '0.62rem', fontWeight: 600,
                                            bgcolor: 'rgba(108,142,255,0.1)', color: 'primary.light',
                                            border: '1px solid rgba(108,142,255,0.25)',
                                            '& .MuiChip-icon': { color: 'primary.light' },
                                        }}
                                    />
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                <EmailIcon sx={{ fontSize: '0.65rem', opacity: 0.45 }} />
                                <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.72rem' }}>
                                    {student.email}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </TableCell>

                {/* Progress bar */}
                <TableCell sx={{ minWidth: 140 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                                flex: 1, height: 5, borderRadius: 3,
                                '& .MuiLinearProgress-bar': {
                                    background: pct >= 100
                                        ? 'linear-gradient(90deg,#4CAF50,#81C784)'
                                        : pct >= 40
                                        ? 'linear-gradient(90deg,#6C8EFF,#B06EFF)'
                                        : 'linear-gradient(90deg,#EF5350,#EF9A9A)',
                                },
                            }}
                        />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: pctColor, minWidth: 34, textAlign: 'right' }}>
                            {pct}%
                        </Typography>
                    </Box>
                </TableCell>

                {/* Passed / Attempted */}
                <TableCell align="center">
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#81C784' }}>
                        {student.challenges_passed}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'primary.light' }}>
                        {student.challenges_attempted}
                    </Typography>
                </TableCell>

                {/* Points */}
                <TableCell align="right">
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFD080' }}>
                        {student.total_points.toLocaleString()}
                    </Typography>
                </TableCell>

                {/* Expand toggle */}
                <TableCell align="center" sx={{ width: 40 }}>
                    <IconButton size="small" aria-label={expanded ? 'Collapse student details' : 'Expand student details'} sx={{ opacity: 0.4 }}>
                        {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* Expanded per-challenge dots */}
            {expanded && (
                <TableRow sx={{ '& td': { borderColor: 'rgba(255,255,255,0.05)', py: 1, background: 'rgba(0,0,0,0.15)' } }}>
                    <TableCell colSpan={6}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, px: 1 }}>
                            {student.per_challenge.map((ch) => (
                                <ChallengeDot key={ch.id} ch={ch} />
                            ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, px: 1 }}>
                            {[
                                { color: '#81C784', label: 'Passed' },
                                { color: '#EF9A9A', label: 'Failed' },
                                { color: 'rgba(255,255,255,0.15)', label: 'Not attempted' },
                            ].map(({ color, label }) => (
                                <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                                    <Typography variant="caption" sx={{ opacity: 0.5, fontSize: '0.68rem' }}>{label}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}

// ── Teacher course panel ──────────────────────────────────────────────────────
function TeacherCoursePanel({ course, navigate, open, onToggle }) {

    return (
        <Box sx={{
            borderRadius: 2,
            border: '1px solid rgba(176,110,255,0.12)',
            background: 'rgba(176,110,255,0.02)',
            overflow: 'hidden',
        }}>
            {/* Panel header */}
            <Box
                onClick={onToggle}
                sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    px: 2.5, py: 1.75,
                    borderBottom: open ? '1px solid rgba(176,110,255,0.1)' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    '&:hover': { background: 'rgba(176,110,255,0.04)' },
                }}
            >
                {/* Thumbnail */}
                <Box sx={{
                    width: 42, height: 42, borderRadius: 1.5, overflow: 'hidden', flexShrink: 0,
                    background: 'rgba(176,110,255,0.1)', border: '1px solid rgba(176,110,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {course.featured_image
                        ? <img src={course.featured_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <SchoolIcon sx={{ fontSize: '1.1rem', color: '#B06EFF', opacity: 0.6 }} />
                    }
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography
                            onClick={(e) => { e.stopPropagation(); navigate(`/course/${course.slug}`); }}
                            sx={{
                                fontWeight: 700, fontSize: '0.95rem',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                '&:hover': { color: 'secondary.light', textDecoration: 'underline' },
                                cursor: 'pointer',
                            }}
                        >
                            {course.title}
                        </Typography>
                        {course.level && (
                            <Chip label={course.level} size="small" sx={{
                                height: 18, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize',
                                background: 'rgba(176,110,255,0.1)', color: '#C990FF',
                                border: '1px solid rgba(176,110,255,0.2)',
                            }} />
                        )}
                        <Chip label={course.status} size="small" sx={{
                            height: 18, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize',
                            background: course.status === 'published' ? 'rgba(76,175,80,0.1)' : 'rgba(255,183,77,0.1)',
                            color: course.status === 'published' ? '#81C784' : '#FFD080',
                            border: `1px solid ${course.status === 'published' ? 'rgba(76,175,80,0.2)' : 'rgba(255,183,77,0.2)'}`,
                        }} />
                    </Box>
                    <Typography variant="caption" sx={{ opacity: 0.45 }}>
                        {course.total_challenges} challenge{course.total_challenges !== 1 ? 's' : ''} · {course.student_count} student{course.student_count !== 1 ? 's' : ''}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                    <Chip
                        icon={<PeopleIcon sx={{ fontSize: '0.75rem !important' }} />}
                        label={course.student_count}
                        size="small"
                        sx={{
                            height: 22, fontSize: '0.72rem', fontWeight: 700,
                            background: 'rgba(176,110,255,0.1)', color: '#C990FF',
                            border: '1px solid rgba(176,110,255,0.2)',
                            '& .MuiChip-icon': { color: '#C990FF' },
                        }}
                    />
                    <IconButton size="small" aria-label={open ? 'Collapse course' : 'Expand course'} sx={{ opacity: 0.4 }}>
                        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                </Box>
            </Box>

            {/* Students table */}
            <Collapse in={open}>
                {course.students.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4, opacity: 0.4 }}>
                        <PeopleIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                        <Typography sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
                            No students have started this course yet.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table size="small" sx={{ minWidth: 560 }}>
                            <TableHead>
                                <TableRow sx={{ '& th': { borderColor: 'rgba(255,255,255,0.05)', py: 1, opacity: 0.5, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                                    <TableCell>Student</TableCell>
                                    <TableCell>Progress</TableCell>
                                    <TableCell align="center">Passed</TableCell>
                                    <TableCell align="center">Attempted</TableCell>
                                    <TableCell align="right">Points</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {course.students.map((student) => (
                                    <StudentRow key={student.email} student={student} />
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                )}
            </Collapse>
        </Box>
    );
}

// ── Teacher section ───────────────────────────────────────────────────────────
function TeacherSection({ navigate }) {
    const { teacherDashboard, loading, getTeacherDashboard } = useGetTeacherDashboard();
    const [openMap, setOpenMap] = useState({});
    const [query, setQuery] = useState('');

    useEffect(() => { getTeacherDashboard(); }, []);

    useEffect(() => {
        if (teacherDashboard?.courses?.length) {
            setOpenMap(Object.fromEntries(teacherDashboard.courses.map(c => [c.slug, true])));
        }
    }, [teacherDashboard]);

    const allExpanded = teacherDashboard?.courses?.length > 0 &&
        teacherDashboard.courses.every(c => openMap[c.slug]);

    const toggleAll  = () => setOpenMap(Object.fromEntries(teacherDashboard.courses.map(c => [c.slug, !allExpanded])));
    const toggleOne  = (slug) => setOpenMap(prev => ({ ...prev, [slug]: !prev[slug] }));

    const q = query.trim().toLowerCase();
    const filteredCourses = teacherDashboard?.courses
        ? teacherDashboard.courses
            .map(course => {
                if (!q) return { ...course, _filtered: false };
                const courseMatch = course.title.toLowerCase().includes(q);
                const filteredStudents = course.students.filter(s =>
                    s.username.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
                );
                if (!courseMatch && filteredStudents.length === 0) return null;
                return { ...course, students: courseMatch ? course.students : filteredStudents, _filtered: true };
            })
            .filter(Boolean)
        : [];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Section header */}
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                pb: 1.5, borderBottom: '1px solid rgba(176,110,255,0.12)',
            }}>
                <Box sx={{
                    p: 0.75, borderRadius: 1.5,
                    background: 'rgba(176,110,255,0.12)',
                    border: '1px solid rgba(176,110,255,0.2)',
                    display: 'flex', alignItems: 'center',
                }}>
                    <PeopleIcon sx={{ fontSize: '1.1rem', color: '#C990FF' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>
                        My Courses · Student Performance
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.45 }}>
                        Students enrolled in your courses, their progress and challenge scores
                    </Typography>
                </Box>
                {!loading && teacherDashboard?.courses?.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                        <TextField
                            size="small"
                            placeholder="Search courses or students…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: '0.95rem', opacity: 0.45 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: 220,
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '0.78rem', height: 30,
                                    borderRadius: 1.5,
                                    '& fieldset': { borderColor: 'rgba(176,110,255,0.2)' },
                                    '&:hover fieldset': { borderColor: 'rgba(176,110,255,0.4)' },
                                    '&.Mui-focused fieldset': { borderColor: 'rgba(176,110,255,0.6)' },
                                },
                                '& .MuiInputBase-input': { py: 0 },
                            }}
                        />
                        {teacherDashboard.courses.length > 1 && (
                            <Tooltip title={allExpanded ? 'Collapse all' : 'Expand all'}>
                                <IconButton
                                    size="small"
                                    onClick={toggleAll}
                                    sx={{
                                        width: 30, height: 30, borderRadius: 1.5,
                                        border: '1px solid rgba(176,110,255,0.2)',
                                        color: '#C990FF',
                                        '&:hover': { background: 'rgba(176,110,255,0.08)', borderColor: 'rgba(176,110,255,0.4)' },
                                    }}
                                >
                                    {allExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {Array.from({ length: 2 }).map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={160} sx={{ borderRadius: 2 }} animation="wave" />
                    ))}
                </Box>
            ) : !teacherDashboard || teacherDashboard.courses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 5, opacity: 0.4 }}>
                    <SchoolIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
                    <Typography sx={{ fontStyle: 'italic' }}>You haven't created any courses yet.</Typography>
                </Box>
            ) : filteredCourses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, opacity: 0.4 }}>
                    <SearchIcon sx={{ fontSize: '2rem', mb: 0.5 }} />
                    <Typography sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>No courses or students match "{query}"</Typography>
                </Box>
            ) : (
                filteredCourses.map((course) => (
                    <TeacherCoursePanel
                        key={course.slug}
                        course={course}
                        navigate={navigate}
                        open={openMap[course.slug] ?? true}
                        onToggle={() => toggleOne(course.slug)}
                    />
                ))
            )}
        </Box>
    );
}

// ── Saved courses section ─────────────────────────────────────────────────────
function SavedCoursesSection({ navigate }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        courseService.getBookmarkedCourses()
            .then(res => setCourses(res?.results ?? res ?? []))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && courses.length === 0) return null;

    return (
        <>
            <Divider sx={{ borderColor: 'rgba(108,142,255,0.1)' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    pb: 1.5, borderBottom: '1px solid rgba(108,142,255,0.12)',
                }}>
                    <Box sx={{
                        p: 0.75, borderRadius: 1.5,
                        background: 'rgba(108,142,255,0.12)',
                        border: '1px solid rgba(108,142,255,0.2)',
                        display: 'flex', alignItems: 'center',
                    }}>
                        <BookmarkSavedIcon sx={{ fontSize: '1.1rem', color: 'primary.light' }} />
                    </Box>
                    <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem' }}>Saved Courses</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.45 }}>Courses you bookmarked for later</Typography>
                    </Box>
                    {!loading && (
                        <Chip label={courses.length} size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem', background: 'rgba(108,142,255,0.15)', color: 'primary.light' }} />
                    )}
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {[1, 2].map(i => <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 1.5 }} animation="wave" />)}
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                        {courses.map(course => (
                            <Box
                                key={course.slug}
                                onClick={() => navigate(`/course/${course.slug}`)}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5,
                                    px: 2, py: 1.25, borderRadius: 1.5,
                                    border: '1px solid rgba(108,142,255,0.1)',
                                    background: 'rgba(108,142,255,0.03)',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                    '&:hover': { background: 'rgba(108,142,255,0.08)' },
                                }}
                            >
                                <Box sx={{
                                    width: 36, height: 36, borderRadius: 1, overflow: 'hidden', flexShrink: 0,
                                    background: 'rgba(108,142,255,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {course.featured_image
                                        ? <img src={course.featured_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        : <SchoolIcon sx={{ fontSize: '1rem', color: 'primary.light', opacity: 0.6 }} />
                                    }
                                </Box>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {course.title}
                                    </Typography>
                                    <Typography variant="caption" sx={{ opacity: 0.45 }}>{course.owner}</Typography>
                                </Box>
                                {course.level && (
                                    <Chip label={course.level} size="small" sx={{
                                        height: 18, fontSize: '0.62rem', fontWeight: 600, textTransform: 'capitalize',
                                        background: 'rgba(108,142,255,0.1)', color: 'primary.light',
                                        border: '1px solid rgba(108,142,255,0.2)',
                                    }} />
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </>
    );
}

// ── Password change panel ─────────────────────────────────────────────────────
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

function getPasswordError(pw) {
    if (!pw) return '';
    if (pw.length < 8) return 'At least 8 characters required.';
    if (!/[A-Z]/.test(pw)) return 'Must contain at least one uppercase letter.';
    if (!/[a-z]/.test(pw)) return 'Must contain at least one lowercase letter.';
    if (!/\d/.test(pw)) return 'Must contain at least one digit.';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return 'Must contain at least one special character.';
    return '';
}

function PasswordChangePanel({ email }) {
    const [open, setOpen] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordTouched, setPasswordTouched] = useState(false);
    const { requesting, confirming, codeSent, requestReset, confirmReset } = useForgotPassword();

    const passwordError = getPasswordError(newPassword);
    const passwordValid = PASSWORD_REGEX.test(newPassword);

    const handleConfirm = async () => {
        setPasswordTouched(true);
        if (!passwordValid) return;
        const ok = await confirmReset({ email, otp_code: otp.trim(), new_password: newPassword });
        if (ok) {
            setOpen(false);
            setOtp('');
            setNewPassword('');
            setPasswordTouched(false);
        }
    };

    return (
        <Box sx={{
            borderRadius: 2,
            border: '1px solid rgba(108,142,255,0.15)',
            overflow: 'hidden',
        }}>
            <Box
                onClick={() => {
                    if (open) { setOtp(''); setNewPassword(''); setPasswordTouched(false); }
                    setOpen(v => !v);
                }}
                sx={{
                    px: 2.5, py: 1.75,
                    display: 'flex', alignItems: 'center', gap: 1.5,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    '&:hover': { background: 'rgba(108,142,255,0.04)' },
                }}
            >
                <LockIcon sx={{ fontSize: '1rem', opacity: 0.6, color: 'primary.light' }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', flex: 1 }}>
                    Change Password
                </Typography>
                <IconButton size="small" sx={{ opacity: 0.4 }}>
                    {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
            </Box>

            <Collapse in={open}>
                <Box sx={{ px: 2.5, pb: 2.5, pt: 0.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {!codeSent ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                            <Typography variant="body2" sx={{ opacity: 0.65, flex: 1, minWidth: 200 }}>
                                We'll send a 6-digit code to <strong>{email}</strong>.
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={requesting}
                                onClick={() => requestReset(email)}
                                sx={{ flexShrink: 0 }}
                            >
                                {requesting ? 'Sending…' : 'Send OTP to my email'}
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Typography variant="body2" sx={{ opacity: 0.65 }}>
                                Enter the code sent to <strong>{email}</strong> and your new password.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <TextField
                                    size="small"
                                    label="OTP code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                                    sx={{ width: 140 }}
                                />
                                <TextField
                                    size="small"
                                    label="New password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    onBlur={() => setPasswordTouched(true)}
                                    error={passwordTouched && !!passwordError}
                                    helperText={passwordTouched && passwordError ? passwordError : ''}
                                    sx={{ flex: 1, minWidth: 200 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    disabled={confirming || otp.trim().length !== 6 || !passwordValid}
                                    onClick={handleConfirm}
                                >
                                    {confirming ? 'Confirming…' : 'Confirm'}
                                </Button>
                                <Button
                                    size="small"
                                    variant="text"
                                    disabled={requesting}
                                    onClick={() => requestReset(email)}
                                    sx={{ opacity: 0.6, fontSize: '0.75rem' }}
                                >
                                    {requesting ? 'Sending…' : 'Resend code'}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function DashboardSkeleton() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <Skeleton variant="circular" width={88} height={88} />
                <Box sx={{ flex: 1 }}>
                    <Skeleton width={160} height={32} />
                    <Skeleton width={100} height={20} sx={{ mt: 0.5 }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" sx={{ flex: '1 1 140px', height: 90, borderRadius: 2 }} />
                ))}
            </Box>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
        </Box>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyProfilePage() {
    const navigate = useNavigate();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const { dashboard, loading, getDashboard } = useGetDashboard();
    const { updateProfile, loading: saving } = useUpdateProfile();

    // Edit profile state
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', user_bio: '' });
    const [editFieldErrors, setEditFieldErrors] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isLoggedIn) { navigate('/sign-in'); return; }
        getDashboard();
    }, [isLoggedIn]);

    if (loading || !dashboard) {
        return (
            <MainWrapper>
                <Box sx={{ maxWidth: 1250, mx: 'auto', width: '100%', py: 4 }}>
                    <DashboardSkeleton />
                </Box>
            </MainWrapper>
        );
    }

    const { profile, stats, courses, certificates, recent_activity } = dashboard;
    const isTeacher = profile.role === 'teacher';
    const activeCourses = courses.filter(c => c.completion_pct > 0 && c.completion_pct < 100);
    const completedCourses = courses.filter(c => c.completion_pct >= 100);

    const startEditing = () => {
        setEditForm({ username: profile.username || '', user_bio: profile.user_bio || '' });
        setEditFieldErrors({});
        setAvatarFile(null);
        setAvatarPreview(null);
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setEditFieldErrors({});
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setEditFieldErrors({});
        const fd = new FormData();
        if (editForm.username !== profile.username) fd.append('username', editForm.username);
        fd.append('user_bio', editForm.user_bio);
        if (avatarFile) fd.append('photo', avatarFile);
        const result = await updateProfile(fd);
        if (result?.fieldErrors) {
            setEditFieldErrors(result.fieldErrors);
            return;
        }
        if (result?.data) {
            setEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
            getDashboard();
        }
    };

    return (
        <MainWrapper>
            <Box sx={{ maxWidth: 1250, mx: 'auto', width: '100%', py: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* ── Profile header ── */}
                <Box sx={{
                    p: 3, borderRadius: 3,
                    border: '1px solid rgba(108,142,255,0.12)',
                    background: 'linear-gradient(135deg, rgba(108,142,255,0.06) 0%, rgba(176,110,255,0.04) 100%)',
                    display: 'flex', gap: 2.5, alignItems: 'flex-start', flexWrap: 'wrap',
                    position: 'relative',
                }}>
                    {/* Edit button (top-right) */}
                    {!editing && (
                        <Tooltip title="Edit profile">
                            <IconButton
                                size="small"
                                onClick={startEditing}
                                sx={{
                                    position: 'absolute', top: 12, right: 12,
                                    border: '1px solid rgba(108,142,255,0.25)',
                                    borderRadius: 1.5, color: 'primary.light',
                                    '&:hover': { background: 'rgba(108,142,255,0.1)', borderColor: 'primary.main' },
                                }}
                            >
                                <EditIcon sx={{ fontSize: '0.95rem' }} />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Avatar */}
                    {editing ? (
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }}
                        >
                            <Avatar
                                src={avatarPreview || profile.photo}
                                alt={profile.username}
                                sx={{
                                    width: 80, height: 80,
                                    border: '2px dashed rgba(108,142,255,0.5)',
                                    fontSize: '1.8rem', fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                                    opacity: 0.85,
                                }}
                            >
                                {profile.username?.[0]?.toUpperCase()}
                            </Avatar>
                            <Box sx={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'rgba(0,0,0,0.3)',
                            }}>
                                <EditIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                            </Box>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                        </Box>
                    ) : (
                        <Avatar
                            src={profile.photo}
                            alt={profile.username}
                            sx={{
                                width: 80, height: 80, flexShrink: 0,
                                border: '2px solid rgba(108,142,255,0.3)',
                                fontSize: '1.8rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                            }}
                        >
                            {profile.username?.[0]?.toUpperCase()}
                        </Avatar>
                    )}

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {editing ? (
                            /* ── Edit form ── */
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Tooltip
                                    title={profile.moodle_platform ? 'Managed by Moodle — cannot be changed' : ''}
                                    placement="top-start"
                                    disableHoverListener={!profile.moodle_platform}
                                >
                                    <span>
                                        <TextField
                                            size="small"
                                            label="Username"
                                            value={editForm.username}
                                            onChange={(e) => {
                                                setEditForm(f => ({ ...f, username: e.target.value }));
                                                if (editFieldErrors.username) setEditFieldErrors(f => ({ ...f, username: undefined }));
                                            }}
                                            disabled={!!profile.moodle_platform}
                                            error={!!editFieldErrors.username}
                                            helperText={editFieldErrors.username || ''}
                                            fullWidth
                                        />
                                    </span>
                                </Tooltip>
                                <TextField
                                    size="small"
                                    label="Bio"
                                    multiline
                                    minRows={2}
                                    value={editForm.user_bio}
                                    onChange={(e) => setEditForm(f => ({ ...f, user_bio: e.target.value }))}
                                    fullWidth
                                    inputProps={{ maxLength: 255 }}
                                />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disabled={saving}
                                        onClick={handleSave}
                                    >
                                        {saving ? 'Saving…' : 'Save'}
                                    </Button>
                                    <Button size="small" onClick={cancelEditing} disabled={saving}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            /* ── Static display ── */
                            <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                        {profile.username}
                                    </Typography>
                                    {profile.email_verified ? (
                                        <Tooltip title="Email verified">
                                            <VerifiedIcon sx={{ fontSize: '1.1rem', color: 'primary.light' }} />
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Email not verified">
                                            <WarningAmberIcon sx={{ fontSize: '1.1rem', color: '#FFD080' }} />
                                        </Tooltip>
                                    )}
                                    <Chip
                                        label={profile.role}
                                        size="small"
                                        sx={{
                                            height: 20, fontSize: '0.68rem', fontWeight: 700, textTransform: 'capitalize',
                                            background: isTeacher ? 'rgba(176,110,255,0.15)' : 'rgba(108,142,255,0.12)',
                                            color: isTeacher ? '#C990FF' : 'primary.light',
                                            border: `1px solid ${isTeacher ? 'rgba(176,110,255,0.3)' : 'rgba(108,142,255,0.2)'}`,
                                        }}
                                    />
                                    {profile.moodle_platform && (
                                        <Chip
                                            icon={<SchoolIcon sx={{ fontSize: '0.75rem !important' }} />}
                                            label={profile.moodle_platform}
                                            size="small"
                                            sx={{
                                                height: 20, fontSize: '0.65rem', fontWeight: 600,
                                                bgcolor: 'rgba(108,142,255,0.1)', color: 'primary.light',
                                                border: '1px solid rgba(108,142,255,0.25)',
                                                '& .MuiChip-icon': { color: 'primary.light' },
                                            }}
                                        />
                                    )}
                                </Box>
                                {profile.email && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                        <EmailIcon sx={{ fontSize: '0.8rem', opacity: 0.4 }} />
                                        <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                            {profile.email}
                                        </Typography>
                                    </Box>
                                )}
                                {profile.user_bio && (
                                    <Typography variant="body2" sx={{ opacity: 0.65, mt: 0.5, lineHeight: 1.5 }}>
                                        {profile.user_bio}
                                    </Typography>
                                )}
                                <Typography variant="caption" sx={{ opacity: 0.4, mt: 0.5, display: 'block' }}>
                                    Joined {format(parseISO(profile.date_joined), 'MMMM yyyy')}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {/* Rank badge */}
                    {!editing && (
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            p: 1.5, borderRadius: 2,
                            background: 'rgba(255,183,77,0.08)',
                            border: '1px solid rgba(255,183,77,0.2)',
                            minWidth: 72,
                        }}>
                            <StarIcon sx={{ fontSize: '1.3rem', color: '#FFD080' }} />
                            <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFD080', lineHeight: 1.1, mt: 0.25 }}>
                                #{stats.rank}
                            </Typography>
                            <Typography sx={{ fontSize: '0.62rem', opacity: 0.6, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                Rank
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── Email verification banner ── */}
                {!profile.email_verified && (
                    <EmailVerificationBanner email={profile.email} />
                )}

                {/* ── Password change ── */}
                <PasswordChangePanel email={profile.email} />

                {/* ── Stats row ── */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <StatCard icon={<TrendingUpIcon sx={{ fontSize: '1rem' }} />} label="Total Points" value={stats.total_points.toLocaleString()} accent="#6C8EFF" />
                    <StatCard icon={<CheckCircleIcon sx={{ fontSize: '1rem' }} />} label="Passed" value={stats.challenges_passed} accent="#4CAF50" />
                    <StatCard icon={<CodeIcon sx={{ fontSize: '1rem' }} />} label="Attempted" value={stats.challenges_attempted} accent="#B06EFF" />
                    <StatCard icon={<WorkspacePremiumIcon sx={{ fontSize: '1rem' }} />} label="Certificates" value={stats.certificates_earned} accent="#FFB74D" />
                    <StatCard icon={<SchoolIcon sx={{ fontSize: '1rem' }} />} label="Courses" value={courses.length} accent="#4DD0E1" />
                </Box>

                {/* ── Two-column grid (student view) ── */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>

                    {/* Courses in progress */}
                    <Box sx={{ borderRadius: 2, border: '1px solid rgba(108,142,255,0.1)', background: 'rgba(108,142,255,0.03)', overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon sx={{ fontSize: '1rem', opacity: 0.6 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>In Progress</Typography>
                            <Chip label={activeCourses.length} size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem', background: 'rgba(108,142,255,0.15)', color: 'primary.light' }} />
                        </Box>
                        <Box sx={{ p: 0.5 }}>
                            {activeCourses.length === 0 ? (
                                <Typography sx={{ px: 1.5, py: 2, opacity: 0.4, fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                                    No courses in progress
                                </Typography>
                            ) : (
                                activeCourses.map(c => <CourseProgressRow key={c.slug} course={c} navigate={navigate} />)
                            )}
                        </Box>

                        {completedCourses.length > 0 && (
                            <>
                                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 1.5 }} />
                                <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircleIcon sx={{ fontSize: '0.85rem', color: 'success.light', opacity: 0.7 }} />
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', opacity: 0.6 }}>Completed</Typography>
                                </Box>
                                <Box sx={{ p: 0.5 }}>
                                    {completedCourses.map(c => <CourseProgressRow key={c.slug} course={c} navigate={navigate} />)}
                                </Box>
                            </>
                        )}
                    </Box>

                    {/* Recent activity */}
                    <Box sx={{ borderRadius: 2, border: '1px solid rgba(108,142,255,0.1)', background: 'rgba(108,142,255,0.03)', overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: '1rem', opacity: 0.6 }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Recent Activity</Typography>
                        </Box>
                        <Box sx={{ p: 0.5 }}>
                            {recent_activity.length === 0 ? (
                                <Typography sx={{ px: 1.5, py: 2, opacity: 0.4, fontSize: '0.85rem', fontStyle: 'italic', textAlign: 'center' }}>
                                    No activity yet
                                </Typography>
                            ) : (
                                recent_activity.map((item, i) => <ActivityRow key={i} item={item} navigate={navigate} />)
                            )}
                        </Box>
                    </Box>
                </Box>

                {/* ── Certificates ── */}
                {certificates.length > 0 && (
                    <Box sx={{ borderRadius: 2, border: '1px solid rgba(255,183,77,0.15)', background: 'rgba(255,183,77,0.03)', overflow: 'hidden' }}>
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,183,77,0.08)', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <WorkspacePremiumIcon sx={{ fontSize: '1rem', color: '#FFD080' }} />
                            <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Certificates</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                            {certificates.map((cert, i) => (
                                <Box
                                    key={i}
                                    onClick={() => navigate(`/course/${cert.course_slug}`)}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Certificate for ${cert.course_title}`}
                                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && navigate(`/course/${cert.course_slug}`)}
                                    sx={{
                                        flex: '1 1 200px',
                                        p: 1.5, borderRadius: 2, cursor: 'pointer',
                                        border: '1px solid rgba(255,183,77,0.2)',
                                        background: 'rgba(255,183,77,0.06)',
                                        display: 'flex', flexDirection: 'column', gap: 0.5,
                                        transition: 'background 0.15s, border-color 0.15s',
                                        '&:hover': { background: 'rgba(255,183,77,0.1)', borderColor: 'rgba(255,183,77,0.35)' },
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                        <EmojiEventsIcon sx={{ fontSize: '1rem', color: '#FFD080' }} />
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {cert.course_title}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>
                                        {format(parseISO(cert.issued_at), 'MMM d, yyyy')} · {Math.round(cert.score_pct)}% score
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* ── Saved courses ── */}
                <SavedCoursesSection navigate={navigate} />

                {/* ── Teacher: student performance section ── */}
                {isTeacher && (
                    <>
                        <Divider sx={{ borderColor: 'rgba(176,110,255,0.1)' }} />
                        <TeacherSection navigate={navigate} />
                    </>
                )}

            </Box>
        </MainWrapper>
    );
}
