// LessonView.jsx — renders a single lesson's content (text, video, or mixed)
import * as React from 'react';
import { useState } from 'react';
import {
    Box, Typography, Chip, Divider, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, CircularProgress,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import useIsOwner from '../../../hooks/permissionHooks/useIsOwner.jsx';
import useUpdateLesson from '../../../hooks/lessonHooks/useUpdateLesson.jsx';
import useDeleteLesson from '../../../hooks/lessonHooks/useDeleteLesson.jsx';
import RichContent from '../../../components/common/RichContent.jsx';
import ImageUploadField from '../../../components/common/ImageUploadField.jsx';

const CONTENT_TYPES = ['text', 'video', 'mixed'];

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

// Extract YouTube/Vimeo embed URL
function toEmbedUrl(url = '') {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([A-Za-z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
}

function VideoEmbed({ url }) {
    const embed = toEmbedUrl(url);
    if (!embed) return null;
    return (
        <Box sx={{
            position: 'relative', width: '100%', paddingTop: '56.25%',
            borderRadius: 2, overflow: 'hidden',
            border: '1px solid rgba(108,142,255,0.15)',
            background: '#000',
        }}>
            <Box
                component="iframe"
                src={embed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                sx={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none',
                }}
            />
        </Box>
    );
}

function TeacherLessonToolbar({ lesson, owner, onUpdated, onDeleted }) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoCleared, setPhotoCleared] = useState(false);
    const [form, setForm] = useState({
        title: lesson.title || '',
        content: lesson.content || '',
        video_url: lesson.video_url || '',
        content_type: lesson.content_type || 'text',
    });
    const { updateLesson, loading: updating } = useUpdateLesson();
    const { deleteLesson, loading: deleting } = useDeleteLesson();
    const isOwner = useIsOwner({ owner });
    if (!isOwner) return null;

    const handleEditOpen = () => {
        setForm({
            title: lesson.title || '',
            content: lesson.content || '',
            video_url: lesson.video_url || '',
            content_type: lesson.content_type || 'text',
        });
        setPhotoFile(null);
        setPhotoCleared(false);
        setEditOpen(true);
    };

    const handleSave = async () => {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (photoFile) {
            fd.append('photo', photoFile);
        } else if (photoCleared) {
            fd.append('remove_photo', '1');
        }
        const res = await updateLesson({ slug: lesson.slug, payload: fd });
        if (res) { setEditOpen(false); onUpdated?.(); }
    };

    const handleDelete = async () => {
        const ok = await deleteLesson({ slug: lesson.slug });
        if (ok) { setDeleteOpen(false); onDeleted?.(); }
    };

    const existingPhotoUrl = lesson.photo
        ? (lesson.photo.startsWith('http') ? lesson.photo : `${import.meta.env.VITE_API_URL}${lesson.photo}`)
        : null;

    return (
        <>
            <Box sx={{ display: 'flex', gap: 0.75, mt: 2 }}>
                <Tooltip title="Edit lesson">
                    <IconButton size="small" onClick={handleEditOpen} sx={{
                        border: '1px solid rgba(108,142,255,0.25)', borderRadius: 1.5, color: 'primary.light',
                        '&:hover': { background: 'rgba(108,142,255,0.1)' },
                    }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete lesson">
                    <IconButton size="small" onClick={() => setDeleteOpen(true)} sx={{
                        border: '1px solid rgba(244,67,54,0.25)', borderRadius: 1.5, color: 'error.light',
                        '&:hover': { background: 'rgba(244,67,54,0.08)' },
                    }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Edit Lesson</DialogTitle>
                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField fullWidth label="Title" value={form.title}
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} size="small" />
                        <TextField select label="Type" value={form.content_type}
                            onChange={e => setForm(p => ({ ...p, content_type: e.target.value }))}
                            size="small" sx={{ minWidth: 100 }}>
                            {CONTENT_TYPES.map(t => <MenuItem key={t} value={t} sx={{ textTransform: 'capitalize' }}>{t}</MenuItem>)}
                        </TextField>
                    </Box>
                    <ImageUploadField
                        existingUrl={existingPhotoUrl}
                        onChange={(file) => {
                            setPhotoFile(file);
                            setPhotoCleared(file === null && !!lesson.photo);
                        }}
                        label="Add / replace image"
                    />
                    {(form.content_type === 'video' || form.content_type === 'mixed') && (
                        <TextField fullWidth label="Video URL (YouTube / Vimeo)" value={form.video_url}
                            onChange={e => setForm(p => ({ ...p, video_url: e.target.value }))} size="small" />
                    )}
                    {(form.content_type === 'text' || form.content_type === 'mixed') && (
                        <TextField fullWidth multiline minRows={12}
                            label="Content (Markdown + LaTeX)" value={form.content}
                            onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                            onKeyDown={e => handleTabKey(e, form.content, v => setForm(p => ({ ...p, content: v })))}
                            inputProps={{ spellCheck: false }}
                            helperText="Wrap LaTeX in delimiters: $inline$ or $$block$$  — e.g. $$\text{MAE} = \frac{1}{n}\sum|y_i - \hat{y}_i|$$"
                            sx={{ '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.82rem' } }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} size="small">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" size="small" disabled={!form.title.trim() || updating}
                        endIcon={updating ? <CircularProgress size={14} color="inherit" /> : null}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete lesson?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        "{lesson.title}" will be permanently deleted.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} size="small">Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error" size="small" disabled={deleting}>
                        {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function LessonView({ lesson, owner, onUpdated, onDeleted }) {
    const ICON = lesson.content_type === 'video' ? PlayCircleIcon : MenuBookIcon;
    const iconColor = lesson.content_type === 'video' ? '#B06EFF' : '#6C8EFF';

    const photoUrl = lesson.photo
        ? (lesson.photo.startsWith('http') ? lesson.photo : `${import.meta.env.VITE_API_URL}${lesson.photo}`)
        : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Lesson header */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{
                    p: 1, borderRadius: 1.5, flexShrink: 0,
                    background: `${iconColor}15`,
                    border: `1px solid ${iconColor}30`,
                    display: 'flex', alignItems: 'center',
                }}>
                    <ICON sx={{ fontSize: '1.2rem', color: iconColor }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {lesson.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip label={lesson.content_type} size="small" sx={{
                            height: 18, fontSize: '0.65rem', fontWeight: 600, textTransform: 'capitalize',
                            background: 'rgba(108,142,255,0.1)', color: 'primary.light',
                            border: '1px solid rgba(108,142,255,0.2)',
                        }} />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Video */}
            {(lesson.content_type === 'video' || lesson.content_type === 'mixed') && lesson.video_url && (
                <VideoEmbed url={lesson.video_url} />
            )}

            {/* Text content — RichContent handles LaTeX, images, and inline markdown */}
            {(lesson.content_type === 'text' || lesson.content_type === 'mixed') && (lesson.content || photoUrl) && (
                <RichContent
                    text={lesson.content}
                    photo={photoUrl}
                    photoAlt={lesson.title}
                    sx={{
                        lineHeight: 1.8,
                        color: 'text.primary',
                        '& .math-block': { my: 1.5, overflowX: 'auto', textAlign: 'center' },
                        '& .katex': { fontSize: '1em' },
                    }}
                />
            )}

            {/* Teacher toolbar */}
            <TeacherLessonToolbar lesson={lesson} owner={owner} onUpdated={onUpdated} onDeleted={onDeleted} />
        </Box>
    );
}
