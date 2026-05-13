import * as React from 'react';
import { useState } from 'react';
import {
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, MenuItem, CircularProgress, Box,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import useIsOwner from '../../../hooks/permissionHooks/useIsOwner.jsx';
import useCreateLesson from '../../../hooks/lessonHooks/useCreateLesson.jsx';
import ImageUploadField from '../../../components/common/ImageUploadField.jsx';

const CONTENT_TYPES = ['text', 'video', 'mixed'];

const INITIAL = {
    title: '', content: '', video_url: '',
    content_type: 'text',
};

// Insert 4 spaces at cursor position when Tab is pressed in a textarea
function handleTabKey(e, value, onChange) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.substring(0, start) + '    ' + value.substring(end);
    onChange(next);
    requestAnimationFrame(() => {
        el.selectionStart = start + 4;
        el.selectionEnd = start + 4;
    });
}

export default function CreateLessonButton({ topicSlug, owner, onCreated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(INITIAL);
    const [photoFile, setPhotoFile] = useState(null);
    const { createLesson, loading } = useCreateLesson();
    const isOwner = useIsOwner({ owner });
    if (!isOwner) return null;

    const handleClose = () => { setOpen(false); setForm(INITIAL); setPhotoFile(null); };

    const handleSubmit = async () => {
        const res = await createLesson({
            topicSlug,
            title: form.title,
            content: form.content,
            videoUrl: form.video_url,
            contentType: form.content_type,
            photo: photoFile,
        });
        if (res) { onCreated?.(); handleClose(); }
    };

    return (
        <>
            <Tooltip title="Add lesson">
                <IconButton size="small" onClick={() => setOpen(true)} sx={{
                    border: '1px solid rgba(176,110,255,0.3)', borderRadius: 1.5, color: 'secondary.light',
                    '&:hover': { background: 'rgba(176,110,255,0.1)', borderColor: 'secondary.main' },
                }}>
                    <MenuBookIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>New Lesson</DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField fullWidth label="Title" value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            size="small" required />
                        <TextField select label="Type" value={form.content_type}
                            onChange={e => setForm(p => ({ ...p, content_type: e.target.value }))}
                            size="small" sx={{ minWidth: 100 }}>
                            {CONTENT_TYPES.map(t => <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>)}
                        </TextField>
                    </Box>

                    <ImageUploadField
                        onChange={setPhotoFile}
                        label="Add image"
                    />

                    {(form.content_type === 'video' || form.content_type === 'mixed') && (
                        <TextField fullWidth label="Video URL (YouTube / Vimeo)" value={form.video_url}
                            onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} size="small" />
                    )}

                    {(form.content_type === 'text' || form.content_type === 'mixed') && (
                        <TextField fullWidth multiline minRows={12}
                            label="Content (Markdown + LaTeX)"
                            value={form.content}
                            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                            onKeyDown={e => handleTabKey(e, form.content, v => setForm(p => ({ ...p, content: v })))}
                            inputProps={{ spellCheck: false }}
                            helperText="Wrap LaTeX in delimiters: $inline$ or $$block$$  — e.g. $$\text{MAE} = \frac{1}{n}\sum|y_i - \hat{y}_i|$$"
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.82rem' } }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} size="small">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" size="small"
                        disabled={!form.title.trim() || loading}
                        endIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
