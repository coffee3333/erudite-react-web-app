// CourseFormDialog.jsx — modal for both creating and editing a course
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Box, CircularProgress, Chip,
} from '@mui/material';
import ImageUploadField from '../../../components/common/ImageUploadField.jsx';

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const STATUSES = ['published', 'draft', 'archived', 'private'];

const buildInitial = (data) => ({
    title: data?.title || '',
    description: data?.description || '',
    level: data?.level || 'beginner',
    language: data?.language || 'en',
    status: data?.status || 'published',
});

export default function CourseFormDialog({ open, onClose, onSubmit, loading, initialData = null }) {
    const isEdit = !!initialData;
    const [form, setForm] = useState(buildInitial(initialData));
    const [photoFile, setPhotoFile] = useState(null);
    const [errors, setErrors] = useState({});

    // Reset form whenever dialog opens
    useEffect(() => {
        if (open) {
            setForm(buildInitial(initialData));
            setPhotoFile(null);
            setErrors({});
        }
    }, [open]);

    const validate = (f = form) => {
        const e = {};
        if (!f.title.trim()) e.title = 'Title is required';
        if (!f.description.trim()) e.description = 'Description is required';
        if (!f.level) e.level = 'Level is required';
        return e;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...form, [name]: value };
        setForm(updated);
        setErrors(validate(updated));
    };

    const handleSubmit = () => {
        const found = validate();
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('description', form.description);
        fd.append('level', form.level);
        fd.append('language', form.language);
        fd.append('status', form.status);
        if (photoFile) fd.append('featured_image', photoFile);
        onSubmit(fd);
    };

    const existingImageUrl = initialData?.featured_image || null;
    const isValid = Object.keys(errors).length === 0 && form.title.trim() && form.description.trim() && form.level;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {isEdit ? 'Edit Course' : 'New Course'}
                {isEdit && (
                    <Chip
                        label={form.status}
                        size="small"
                        sx={{
                            height: 20, fontSize: '0.68rem', fontWeight: 600, textTransform: 'capitalize',
                            background: form.status === 'published' ? 'rgba(76,175,80,0.12)' : form.status === 'private' ? 'rgba(108,142,255,0.12)' : 'rgba(255,255,255,0.06)',
                            color: form.status === 'published' ? 'success.light' : form.status === 'private' ? 'primary.light' : 'text.secondary',
                            border: `1px solid ${form.status === 'published' ? 'rgba(76,175,80,0.25)' : form.status === 'private' ? 'rgba(108,142,255,0.25)' : 'rgba(255,255,255,0.1)'}`,
                        }}
                    />
                )}
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <TextField
                    fullWidth label="Title" name="title"
                    value={form.title} onChange={handleChange}
                    size="small" required
                    error={!!errors.title} helperText={errors.title}
                />

                <TextField
                    fullWidth multiline minRows={4}
                    label="Description" name="description"
                    value={form.description} onChange={handleChange}
                    size="small" required
                    error={!!errors.description} helperText={errors.description}
                />

                <ImageUploadField
                    existingUrl={existingImageUrl}
                    onChange={setPhotoFile}
                    label="Featured image"
                />

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <TextField
                        select fullWidth label="Level" name="level"
                        value={form.level} onChange={handleChange}
                        size="small" error={!!errors.level} helperText={errors.level}
                    >
                        {LEVELS.map(l => (
                            <MenuItem key={l} value={l} sx={{ textTransform: 'capitalize' }}>{l}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select fullWidth label="Status" name="status"
                        value={form.status} onChange={handleChange}
                        size="small"
                    >
                        {STATUSES.map(s => (
                            <MenuItem key={s} value={s} sx={{ textTransform: 'capitalize' }}>{s}</MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} size="small">Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="small"
                    disabled={!isValid || loading}
                    endIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
                >
                    {isEdit ? 'Save' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
