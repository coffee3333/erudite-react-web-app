/**
 * ImageUploadField.jsx
 * Compact image upload button + preview. Accepts a File via onChange(file).
 */
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';

export default function ImageUploadField({ value, onChange, existingUrl, label = 'Add image' }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [existingCleared, setExistingCleared] = useState(false);

    // Reset when existingUrl changes (e.g. dialog reopens for a different course)
    useEffect(() => {
        setPreview(null);
        setExistingCleared(false);
    }, [existingUrl]);

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setExistingCleared(false);
        onChange(file);
    };

    const handleClear = () => {
        setPreview(null);
        setExistingCleared(true);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const displayUrl = preview || (!existingCleared && existingUrl) || null;

    return (
        <Box>
            {displayUrl ? (
                <Box sx={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                    <Box sx={{
                        borderRadius: 1.5, overflow: 'hidden',
                        border: '1px solid rgba(108,142,255,0.2)',
                        maxHeight: 220,
                        '& img': { display: 'block', maxWidth: '100%', maxHeight: 220, objectFit: 'contain' },
                    }}>
                        <img src={displayUrl} alt="preview" />
                    </Box>
                    <Tooltip title="Remove image">
                        <IconButton
                            size="small"
                            onClick={handleClear}
                            sx={{
                                position: 'absolute', top: 4, right: 4,
                                background: 'rgba(0,0,0,0.6)', color: '#fff',
                                '&:hover': { background: 'rgba(244,67,54,0.8)' },
                                width: 22, height: 22,
                            }}
                        >
                            <CloseIcon sx={{ fontSize: '0.75rem' }} />
                        </IconButton>
                    </Tooltip>
                    <Typography
                        variant="caption"
                        onClick={() => inputRef.current?.click()}
                        sx={{ display: 'block', mt: 0.5, opacity: 0.5, cursor: 'pointer', '&:hover': { opacity: 0.9 } }}
                    >
                        Click to replace
                    </Typography>
                </Box>
            ) : (
                <Box
                    onClick={() => inputRef.current?.click()}
                    sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer',
                        border: '1px dashed rgba(108,142,255,0.25)',
                        color: 'primary.light', opacity: 0.7,
                        transition: 'opacity 0.15s, border-color 0.15s',
                        '&:hover': { opacity: 1, borderColor: 'rgba(108,142,255,0.5)' },
                    }}
                >
                    <AddPhotoAlternateIcon sx={{ fontSize: '1.1rem' }} />
                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 500 }}>{label}</Typography>
                </Box>
            )}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFile}
            />
        </Box>
    );
}
