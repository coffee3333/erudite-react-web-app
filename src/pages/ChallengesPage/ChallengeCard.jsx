// ChallengeCard.jsx
import * as React from 'react';
import { useState } from 'react';
import {
    Box, Typography, Chip, Divider,
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, MenuItem, CircularProgress, useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CodeIcon from '@mui/icons-material/Code';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import QuizIcon from '@mui/icons-material/Quiz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import QuizChallengeCard from './components/QuizChallengeCard.jsx';
import TextChallengeCard from './components/TextChallengeCard.jsx';
import CodeChallengeCard from './components/CodeChallengeCard.jsx';
import MathContent from '../../components/common/MathContent.jsx';
import ImageUploadField from '../../components/common/ImageUploadField.jsx';
import useIsOwner from '../../hooks/permissionHooks/useIsOwner.jsx';
import useDeleteChallenge from '../../hooks/challengeHooks/useDeleteChallenge.jsx';
import useUpdateChallenge from '../../hooks/challengeHooks/useUpdateChallenge.jsx';
import useInView, { prefersReducedMotion } from '../../hooks/useInView.jsx';

const DIFFICULTY_STYLES = {
    easy:   { bg: 'rgba(76,175,80,0.12)',  color: '#81C784', border: 'rgba(76,175,80,0.25)' },
    medium: { bg: 'rgba(255,183,77,0.12)', color: '#FFD080', border: 'rgba(255,183,77,0.25)' },
    hard:   { bg: 'rgba(244,67,54,0.12)',  color: '#EF9A9A', border: 'rgba(244,67,54,0.25)' },
};

const TYPE_ICON = {
    quiz: <QuizIcon sx={{ fontSize: '0.8rem' }} />,
    text: <TextFieldsIcon sx={{ fontSize: '0.8rem' }} />,
    code: <CodeIcon sx={{ fontSize: '0.8rem' }} />,
};

const DIFFICULTIES = ['easy', 'medium', 'hard'];

function TeacherToolbar({ challenge, onDeleted, onUpdated }) {
    const [showAnswer, setShowAnswer] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [form, setForm] = useState({});

    const { deleteChallenge, loading: deleting } = useDeleteChallenge();
    const { updateChallenge, loading: updating } = useUpdateChallenge();

    const buildForm = () => ({
        title: challenge.title || '',
        body: challenge.body || '',
        difficulty: challenge.difficulty || 'easy',
        points: String(challenge.points || 10),
        correct_answer: challenge.correct_answer?.answer || '',
        answers: challenge.options?.map(o => o.text).join(', ') || '',
        case_sensitive: challenge.correct_answer?.case_sensitive || false,
        hint: challenge.hint || '',
        solution_explanation: challenge.solution_explanation || '',
    });

    const handleEditOpen = () => {
        setForm(buildForm());
        setPhotoFile(null);
        setEditOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDelete = async () => {
        const ok = await deleteChallenge({ slug: challenge.slug });
        if (ok) { setDeleteOpen(false); onDeleted?.(); }
    };

    const handleUpdate = async () => {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('body', form.body);
        fd.append('difficulty', form.difficulty);
        fd.append('points', form.points);
        fd.append('correct_answer', form.correct_answer);
        fd.append('case_sensitive', form.case_sensitive);
        if (challenge.challenge_type === 'quiz') fd.append('answers', form.answers);
        fd.append('hint', form.hint || '');
        fd.append('solution_explanation', form.solution_explanation || '');
        if (photoFile) fd.append('photo', photoFile);
        const res = await updateChallenge({ slug: challenge.slug, formData: fd });
        if (res) { setEditOpen(false); onUpdated?.(); }
    };

    // Required fields must be non-empty
    const requiredFilled =
        form.title?.trim() &&
        form.body?.trim() &&
        (challenge.challenge_type === 'code' || form.correct_answer?.trim()) &&
        (challenge.challenge_type !== 'quiz' || form.answers?.trim());

    // Dirty: something changed from original values or a new photo was selected
    const original = buildForm();
    const isDirty = photoFile !== null || Object.keys(original).some(k => form[k] !== original[k]);

    const isEditValid = requiredFilled && isDirty;

    const existingPhotoUrl = challenge.photo
        ? (challenge.photo.startsWith('http') ? challenge.photo : `${import.meta.env.VITE_API_URL}${challenge.photo}`)
        : null;

    return (
        <>
            <Box sx={{
                display: 'flex', alignItems: 'center', gap: 0.75,
                pt: 1.5, mt: 1.5,
                borderTop: '1px solid rgba(108,142,255,0.1)',
            }}>
                {/* Show Answer toggle */}
                {challenge.correct_answer && (
                    <>
                        <Tooltip title={showAnswer ? 'Hide answer' : 'Show answer'}>
                            <IconButton size="small" onClick={() => setShowAnswer(v => !v)} sx={{
                                border: '1px solid rgba(176,110,255,0.3)', borderRadius: 1.5, color: 'secondary.light',
                                '&:hover': { background: 'rgba(176,110,255,0.1)', borderColor: 'secondary.main' },
                            }}>
                                {showAnswer ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>

                        {showAnswer && (
                            <Box sx={{
                                display: 'flex', alignItems: 'center', gap: 0.75,
                                px: 1.25, py: 0.5, borderRadius: 1.5,
                                background: 'rgba(176,110,255,0.1)', border: '1px solid rgba(176,110,255,0.2)',
                            }}>
                                <KeyIcon sx={{ fontSize: '0.75rem', color: 'secondary.light', opacity: 0.8 }} />
                                <Typography sx={{ fontSize: '0.8rem', color: 'secondary.light', fontWeight: 600 }}>
                                    {challenge.correct_answer.answer}
                                </Typography>
                                {challenge.correct_answer.case_sensitive && (
                                    <Chip label="case-sensitive" size="small" sx={{
                                        height: 16, fontSize: '0.62rem',
                                        background: 'rgba(176,110,255,0.15)', color: 'secondary.light',
                                        border: '1px solid rgba(176,110,255,0.2)',
                                    }} />
                                )}
                            </Box>
                        )}
                    </>
                )}

                <Box sx={{ flex: 1 }} />

                <Tooltip title="Edit challenge">
                    <IconButton size="small" onClick={handleEditOpen} sx={{
                        border: '1px solid rgba(108,142,255,0.25)', borderRadius: 1.5, color: 'primary.light',
                        '&:hover': { background: 'rgba(108,142,255,0.1)', borderColor: 'primary.main' },
                    }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>

                <Tooltip title="Delete challenge">
                    <IconButton size="small" onClick={() => setDeleteOpen(true)} sx={{
                        border: '1px solid rgba(244,67,54,0.25)', borderRadius: 1.5, color: 'error.light',
                        '&:hover': { background: 'rgba(244,67,54,0.08)', borderColor: 'error.main' },
                    }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Delete dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete challenge?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        This will permanently delete "{challenge.title}" and all its submissions. This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} size="small">Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error" size="small" disabled={deleting}>
                        {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    Edit Challenge
                    <Chip
                        label={challenge.challenge_type}
                        size="small"
                        sx={{
                            ml: 1.5, height: 20, fontSize: '0.68rem', fontWeight: 600,
                            textTransform: 'capitalize',
                            background: 'rgba(108,142,255,0.12)', color: 'primary.light',
                            border: '1px solid rgba(108,142,255,0.2)',
                        }}
                    />
                </DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        fullWidth label="Title" name="title"
                        value={form.title || ''} onChange={handleChange} size="small" required
                    />
                    <TextField
                        fullWidth multiline minRows={3} name="body"
                        label="Question / Body"
                        value={form.body || ''} onChange={handleChange} size="small" required
                        helperText="Wrap LaTeX in delimiters: $inline$ or $$block$$"
                    />
                    <ImageUploadField
                        existingUrl={existingPhotoUrl}
                        onChange={setPhotoFile}
                        label="Add / replace image"
                    />
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField select label="Difficulty" name="difficulty" value={form.difficulty || 'easy'}
                            onChange={handleChange} size="small" sx={{ minWidth: 120 }}>
                            {DIFFICULTIES.map(d => <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>{d}</MenuItem>)}
                        </TextField>
                        <TextField label="Points" name="points" type="number" value={form.points || 10}
                            onChange={handleChange} size="small" inputProps={{ min: 1, max: 1000 }} sx={{ maxWidth: 100 }} />
                    </Box>
                    {challenge.challenge_type === 'quiz' && (
                        <TextField
                            fullWidth label="Options (comma-separated)" name="answers"
                            value={form.answers || ''} onChange={handleChange} size="small"
                            helperText="Separate each option with a comma" required
                        />
                    )}
                    {challenge.challenge_type !== 'code' && (
                        <TextField
                            fullWidth label="Correct answer" name="correct_answer"
                            value={form.correct_answer || ''} onChange={handleChange} size="small" required
                            helperText={challenge.challenge_type === 'quiz'
                                ? 'Must exactly match one of the options above'
                                : 'The exact text answer expected from students'}
                        />
                    )}
                    <TextField
                        fullWidth multiline minRows={2}
                        label="Hint (optional)" name="hint"
                        value={form.hint || ''} onChange={handleChange} size="small"
                        helperText="Shown to students on demand — costs them 50% of points"
                    />
                    <TextField
                        fullWidth multiline minRows={2}
                        label="Solution explanation (optional)" name="solution_explanation"
                        value={form.solution_explanation || ''} onChange={handleChange} size="small"
                        helperText="Full explanation revealed on demand — blocks student from submitting afterwards"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} size="small">Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" size="small"
                        disabled={!isEditValid || updating}
                        endIcon={updating ? <CircularProgress size={14} color="inherit" /> : null}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function ChallengeCard({ index, challenge, localPassed, onPassed, onRefresh }) {
    const [ref, inView] = useInView();
    const isPassed = localPassed || challenge.user_status === 'passed';
    const isFailed = !isPassed && challenge.user_status === 'failed';
    const diff = DIFFICULTY_STYLES[challenge.difficulty] || DIFFICULTY_STYLES.easy;
    const isOwner = useIsOwner({ owner: challenge.owner });
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const typeChipBg  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(18,21,58,0.05)';
    const typeChipClr = isDark ? 'rgba(255,255,255,0.5)'  : 'rgba(18,21,58,0.5)';
    const typeChipBdr = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,21,58,0.08)';
    const dividerClr  = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(18,21,58,0.06)';

    const photoUrl = challenge.photo
        ? (challenge.photo.startsWith('http') ? challenge.photo : `${import.meta.env.VITE_API_URL}${challenge.photo}`)
        : null;

    return (
        <Box
            ref={ref}
            sx={{
            borderRadius: 2, border: '1px solid',
            borderColor: isPassed ? 'rgba(76,175,80,0.3)' : isFailed ? 'rgba(244,67,54,0.2)' : 'rgba(108,142,255,0.12)',
            background: isPassed
                ? 'linear-gradient(135deg, rgba(76,175,80,0.06) 0%, transparent 60%)'
                : isFailed ? 'rgba(244,67,54,0.04)' : 'rgba(108,142,255,0.03)',
            overflow: 'hidden',
            opacity: prefersReducedMotion ? 1 : (inView ? 1 : 0),
            transform: prefersReducedMotion ? 'none' : (inView ? 'translateY(0)' : 'translateY(24px)'),
            transition: prefersReducedMotion
                ? 'border-color 0.2s, box-shadow 0.2s'
                : `opacity 0.55s ease ${(index % 8) * 70}ms, transform 0.55s ease ${(index % 8) * 70}ms, border-color 0.2s, box-shadow 0.2s`,
            '&:hover': {
                borderColor: isPassed ? 'rgba(76,175,80,0.45)' : 'rgba(108,142,255,0.25)',
                boxShadow: isPassed ? '0 4px 20px rgba(76,175,80,0.08)' : '0 4px 20px rgba(108,142,255,0.08)',
            },
        }}>
            {/* Top accent bar */}
            <Box sx={{
                height: 2,
                background: isPassed
                    ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                    : isFailed ? 'rgba(244,67,54,0.4)'
                    : 'linear-gradient(90deg, rgba(108,142,255,0.3), rgba(176,110,255,0.3))',
            }} />

            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                {/* Header row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, flex: 1, minWidth: 0 }}>
                        <Box sx={{
                            minWidth: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                            background: isPassed ? 'rgba(76,175,80,0.2)' : 'rgba(108,142,255,0.12)',
                            border: `1px solid ${isPassed ? 'rgba(76,175,80,0.3)' : 'rgba(108,142,255,0.2)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {isPassed
                                ? <CheckCircleIcon sx={{ fontSize: '0.95rem', color: 'success.light' }} />
                                : <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'primary.light', lineHeight: 1 }}>{index + 1}</Typography>
                            }
                        </Box>
                        <Typography variant="subtitle1" sx={{
                            fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.35,
                            color: isPassed ? 'success.light' : 'text.primary', pt: 0.25,
                        }}>
                            {challenge.title}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <Chip label={`${challenge.points} pts`} size="small" sx={{
                            height: 22, fontSize: '0.7rem', fontWeight: 700,
                            background: 'rgba(108,142,255,0.1)', color: 'primary.light',
                            border: '1px solid rgba(108,142,255,0.2)',
                        }} />
                        <Chip label={challenge.difficulty} size="small" sx={{
                            height: 22, fontSize: '0.7rem', fontWeight: 600,
                            background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`,
                            textTransform: 'capitalize',
                        }} />
                        <Chip icon={TYPE_ICON[challenge.challenge_type]} label={challenge.challenge_type} size="small" sx={{
                            height: 22, fontSize: '0.7rem', fontWeight: 500,
                            background: typeChipBg, color: typeChipClr,
                            border: `1px solid ${typeChipBdr}`, textTransform: 'capitalize',
                            '& .MuiChip-icon': { color: typeChipClr, ml: 0.5 },
                        }} />
                    </Box>
                </Box>

                {/* Body — supports LaTeX + image */}
                {(challenge.body || photoUrl) && (
                    <MathContent
                        text={challenge.body}
                        photo={photoUrl}
                        photoAlt={challenge.title}
                        sx={{ pl: '44px', mb: 1.5 }}
                    />
                )}

                <Box sx={{ pl: '44px' }}>
                    <Divider sx={{ mb: 1.5, borderColor: dividerClr }} />

                    {challenge.challenge_type === 'quiz' && challenge.options?.length > 0 && (
                        <QuizChallengeCard challenge={challenge} isPassed={isPassed} onPassed={onPassed} />
                    )}
                    {(challenge.challenge_type === 'text' || (challenge.challenge_type === 'quiz' && !challenge.options?.length)) && (
                        <TextChallengeCard challenge={challenge} isPassed={isPassed} onPassed={onPassed} />
                    )}
                    {challenge.challenge_type === 'code' && (
                        <CodeChallengeCard challenge={challenge} isPassed={isPassed} onPassed={onPassed} />
                    )}

                    {isOwner && (
                        <TeacherToolbar challenge={challenge} onDeleted={onRefresh} onUpdated={onRefresh} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}
