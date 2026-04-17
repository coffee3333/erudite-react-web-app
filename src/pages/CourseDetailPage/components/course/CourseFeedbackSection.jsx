import { useEffect, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { format, parse } from 'date-fns';
import useCourseFeedback from '../../../../hooks/courseHooks/useCourseFeedback.jsx';
import useAuthStore from '../../../../stores/authStore.jsx';

function StarRating({ value, onChange, readOnly = false, size = 'medium' }) {
    const [hover, setHover] = useState(0);
    const iconSize = size === 'small' ? 18 : 24;
    return (
        <Box sx={{ display: 'flex', gap: 0.25 }}>
            {[1, 2, 3, 4, 5].map(star => {
                const filled = readOnly ? star <= value : star <= (hover || value);
                return (
                    <Box
                        key={star}
                        data-testid={readOnly ? undefined : `star-${star}`}
                        component={readOnly ? 'span' : 'button'}
                        onClick={readOnly ? undefined : () => onChange?.(star)}
                        onMouseEnter={readOnly ? undefined : () => setHover(star)}
                        onMouseLeave={readOnly ? undefined : () => setHover(0)}
                        sx={{
                            background: 'none',
                            border: 'none',
                            p: 0,
                            cursor: readOnly ? 'default' : 'pointer',
                            color: filled ? '#f5c518' : 'text.disabled',
                            display: 'flex',
                            alignItems: 'center',
                            lineHeight: 1,
                        }}
                    >
                        {filled
                            ? <StarIcon sx={{ fontSize: iconSize }} />
                            : <StarBorderIcon sx={{ fontSize: iconSize }} />
                        }
                    </Box>
                );
            })}
        </Box>
    );
}

function RatingSummary({ feedback }) {
    if (!feedback.length) return null;
    const avg = feedback.reduce((s, f) => s + f.rating, 0) / feedback.length;
    const counts = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: feedback.filter(f => f.rating === star).length,
    }));
    return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
                    {avg.toFixed(1)}
                </Typography>
                <StarRating value={Math.round(avg)} readOnly size="small" />
                <Typography variant="caption" color="text.secondary">
                    {feedback.length} {feedback.length === 1 ? 'review' : 'reviews'}
                </Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 180 }}>
                {counts.map(({ star, count }) => (
                    <Box key={star} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                        <Typography variant="caption" sx={{ width: 16, textAlign: 'right' }}>{star}</Typography>
                        <StarIcon sx={{ fontSize: 14, color: '#f5c518' }} />
                        <Box sx={{
                            flex: 1, height: 8, borderRadius: 4,
                            bgcolor: 'action.hover',
                            overflow: 'hidden',
                        }}>
                            <Box sx={{
                                height: '100%', borderRadius: 4,
                                bgcolor: '#f5c518',
                                width: feedback.length ? `${(count / feedback.length) * 100}%` : '0%',
                                transition: 'width 0.4s',
                            }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ width: 20 }}>{count}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function ReviewCard({ item, onEdit, onDelete, submitting }) {
    const initials = (item.username || '?')[0].toUpperCase();
    return (
        <Box sx={{
            display: 'flex', gap: 2, py: 2,
            borderRadius: 1,
            ...(item.is_own && {
                bgcolor: 'rgba(108,142,255,0.05)',
                border: '1px solid rgba(108,142,255,0.12)',
                px: 1.5,
            }),
        }}>
            <Avatar sx={{ width: 36, height: 36, fontSize: 14, bgcolor: 'primary.dark' }}>
                {item.photo
                    ? <img src={item.photo} alt={item.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : initials
                }
            </Avatar>
            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.username}</Typography>
                    {item.is_own && (
                        <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 500 }}>· Your review</Typography>
                    )}
                    <StarRating value={item.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                        {format(parse(item.updated_at, 'dd.MM.yyyy HH:mm', new Date()), 'MMM d, yyyy')}
                    </Typography>
                </Box>
                {item.comment && (
                    <Typography variant="body2" sx={{ opacity: 0.85, whiteSpace: 'pre-wrap' }}>
                        {item.comment}
                    </Typography>
                )}
            </Box>
            {item.is_own && (
                <Box sx={{ display: 'flex', gap: 0.5, alignSelf: 'flex-start' }}>
                    <Tooltip title="Edit your review">
                        <IconButton data-testid="edit-review" size="small" disabled={submitting} onClick={onEdit}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete your review">
                        <IconButton data-testid="delete-review" size="small" disabled={submitting} onClick={onDelete} color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
}

function FeedbackDialog({ open, onClose, ownReview, slug, submitting, onSubmit, onUpdate, onDelete }) {
    const isEditing = !!ownReview;
    const [rating, setRating] = useState(ownReview?.rating ?? 0);
    const [comment, setComment] = useState(ownReview?.comment ?? '');
    const [formError, setFormError] = useState('');

    // Sync form when dialog opens or ownReview changes
    useEffect(() => {
        if (open) {
            setRating(ownReview?.rating ?? 0);
            setComment(ownReview?.comment ?? '');
            setFormError('');
        }
    }, [open, ownReview?.id]);

    const handleSave = useCallback(async () => {
        if (!rating) { setFormError('Please select a star rating.'); return; }
        setFormError('');
        try {
            if (isEditing) {
                await onUpdate({ slug, rating, comment });
            } else {
                await onSubmit({ slug, rating, comment });
            }
            onClose();
        } catch (err) {
            setFormError(err?.response?.data?.detail ?? 'Failed to save review.');
        }
    }, [rating, comment, isEditing, slug, onSubmit, onUpdate, onClose]);

    const handleDelete = useCallback(async () => {
        try {
            await onDelete({ slug });
            onClose();
        } catch {
            // silent
        }
    }, [slug, onDelete, onClose]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>
                {isEditing ? 'Edit your review' : 'Write a review'}
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                            Your rating
                        </Typography>
                        <StarRating value={rating} onChange={setRating} />
                        {formError && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                {formError}
                            </Typography>
                        )}
                    </Box>
                    <TextField
                        multiline
                        minRows={3}
                        maxRows={8}
                        fullWidth
                        label="Comment (optional)"
                        placeholder="Share your thoughts about this course..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        size="small"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                {isEditing && (
                    <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        disabled={submitting}
                        onClick={handleDelete}
                        sx={{ mr: 'auto' }}
                    >
                        Delete review
                    </Button>
                )}
                <Button onClick={onClose} size="small" disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    size="small"
                    disabled={submitting || !rating}
                    onClick={handleSave}
                >
                    {isEditing ? 'Update' : 'Submit'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function CourseFeedbackSection({ slug, owner }) {
    const isLoggedIn = useAuthStore(s => s.isLoggedIn);
    const currentUser = useAuthStore(s => s.user);
    const { feedback, loading, submitting, fetchFeedback, submitFeedback, updateFeedback, deleteFeedback } = useCourseFeedback();

    const [dialogOpen, setDialogOpen] = useState(false);

    const ownReview = feedback.find(f => f.is_own) ?? null;
    const isOwner = !!currentUser && currentUser.username === owner;
    // Owner cannot review their own course — button hidden for them
    const canReview = isLoggedIn && !isOwner;

    useEffect(() => {
        fetchFeedback(slug);
    }, [slug, fetchFeedback]);

    const sortedFeedback = [...feedback].sort((a, b) => (b.is_own ? 1 : 0) - (a.is_own ? 1 : 0));

    return (
        <Box>
            <Divider sx={{ mb: 3 }} />

            {/* Section header + action button */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Reviews</Typography>
                {canReview && (
                    <Button
                        variant={ownReview ? 'outlined' : 'contained'}
                        size="small"
                        startIcon={ownReview ? <EditIcon /> : <RateReviewIcon />}
                        onClick={() => setDialogOpen(true)}
                        disabled={loading}
                    >
                        {ownReview ? 'Edit your review' : 'Write a review'}
                    </Button>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={28} />
                </Box>
            ) : (
                <>
                    <RatingSummary feedback={feedback} />

                    {sortedFeedback.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            No reviews yet.{canReview ? ' Be the first to review this course.' : ''}
                        </Typography>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {sortedFeedback.map((item, idx) => (
                                <Box key={item.id}>
                                    <ReviewCard
                                        item={item}
                                        onEdit={() => setDialogOpen(true)}
                                        onDelete={async () => {
                                            await deleteFeedback({ slug });
                                        }}
                                        submitting={submitting}
                                    />
                                    {idx < sortedFeedback.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Box>
                    )}
                </>
            )}

            <FeedbackDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                ownReview={ownReview}
                slug={slug}
                submitting={submitting}
                onSubmit={submitFeedback}
                onUpdate={updateFeedback}
                onDelete={deleteFeedback}
            />
        </Box>
    );
}
