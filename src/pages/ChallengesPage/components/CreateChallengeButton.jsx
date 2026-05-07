// CreateChallengeButton.jsx — modal to create quiz or text challenges
import * as React from 'react';
import { useState } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Box, IconButton, CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import useIsOwner from '../../../hooks/permissionHooks/useIsOwner.jsx';
import useCreateChallenge from '../../../hooks/challengeHooks/useCreateChallenge.jsx';
import ImageUploadField from '../../../components/common/ImageUploadField.jsx';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const CHALLENGE_TYPES = [
    { value: 'quiz', label: 'Quiz (Multiple choice)' },
    { value: 'text', label: 'Text (Free-text answer)' },
];

const INITIAL_FORM = {
    title: '',
    body: '',
    difficulty: 'easy',
    challenge_type: 'quiz',
    points: 10,
    answers: '',
    correct_answer: '',
    case_sensitive: false,
    hint: '',
    solution_explanation: '',
};

export default function CreateChallengeButton({ topicSlug, owner, onCreated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const [photoFile, setPhotoFile] = useState(null);
    const { createChallenge, loading } = useCreateChallenge();
    const isOwner = useIsOwner({ owner });

    if (!isOwner) return null;

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setForm(INITIAL_FORM);
        setPhotoFile(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        const fd = new FormData();
        fd.append('topic_slug', topicSlug);
        fd.append('challenge_type', form.challenge_type);
        fd.append('title', form.title);
        fd.append('body', form.body);
        fd.append('difficulty', form.difficulty);
        fd.append('points', form.points);
        fd.append('correct_answer', form.correct_answer);
        fd.append('case_sensitive', form.case_sensitive);
        if (form.challenge_type === 'quiz') {
            fd.append('answers', form.answers);
        }
        if (form.hint.trim()) fd.append('hint', form.hint.trim());
        if (form.solution_explanation.trim()) fd.append('solution_explanation', form.solution_explanation.trim());
        if (photoFile) fd.append('photo', photoFile);

        const res = await createChallenge({ formData: fd });
        if (res) {
            onCreated?.();
            handleClose();
        }
    };

    const isValid =
        form.title.trim() &&
        form.body.trim() &&
        form.correct_answer.trim() &&
        (form.challenge_type === 'text' || form.answers.trim());

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpen}
                size="small"
            >
                Add Challenge
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    New Challenge
                    <IconButton size="small" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        select fullWidth label="Type" name="challenge_type"
                        value={form.challenge_type} onChange={handleChange} size="small"
                    >
                        {CHALLENGE_TYPES.map((t) => (
                            <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        fullWidth label="Title" name="title"
                        value={form.title} onChange={handleChange} size="small" required
                    />

                    <TextField
                        fullWidth multiline minRows={3}
                        label="Question / Body"
                        name="body" value={form.body} onChange={handleChange} size="small" required
                        helperText="Wrap LaTeX in delimiters: $inline$ or $$block$$  — e.g. $$\frac{1}{n}\sum|y_i|$$"
                    />

                    <ImageUploadField
                        onChange={setPhotoFile}
                        label="Add image"
                    />

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField
                            select label="Difficulty" name="difficulty"
                            value={form.difficulty} onChange={handleChange}
                            size="small" sx={{ minWidth: 120 }}
                        >
                            {DIFFICULTIES.map((d) => (
                                <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>{d}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Points" name="points" type="number"
                            value={form.points} onChange={handleChange}
                            size="small" inputProps={{ min: 1, max: 1000 }} sx={{ maxWidth: 100 }}
                        />
                    </Box>

                    {form.challenge_type === 'quiz' && (
                        <TextField
                            fullWidth label="Options (comma-separated)" name="answers"
                            value={form.answers} onChange={handleChange} size="small"
                            placeholder="Paris, London, Berlin, Madrid"
                            helperText="Separate each option with a comma" required
                        />
                    )}

                    <TextField
                        fullWidth label="Correct answer" name="correct_answer"
                        value={form.correct_answer} onChange={handleChange} size="small" required
                        helperText={
                            form.challenge_type === 'quiz'
                                ? 'Must exactly match one of the options above'
                                : 'The exact text answer expected from students'
                        }
                    />

                    <TextField
                        fullWidth multiline minRows={2}
                        label="Hint (optional)"
                        name="hint" value={form.hint} onChange={handleChange} size="small"
                        helperText="Shown to students on demand — costs them 50% of points"
                    />

                    <TextField
                        fullWidth multiline minRows={2}
                        label="Solution explanation (optional)"
                        name="solution_explanation" value={form.solution_explanation} onChange={handleChange} size="small"
                        helperText="Full explanation revealed on demand — blocks student from submitting afterwards"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} size="small">Cancel</Button>
                    <Button
                        onClick={handleSubmit} variant="contained" size="small"
                        disabled={!isValid || loading}
                        endIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
