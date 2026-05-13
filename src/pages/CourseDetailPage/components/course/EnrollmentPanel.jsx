import { useEffect, useState } from 'react';
import {
    Box, Typography, TextField, IconButton, List, ListItem,
    ListItemText, ListItemSecondaryAction, Divider, CircularProgress, Chip, Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { format, parseISO } from 'date-fns';
import useIsOwner from '../../../../hooks/permissionHooks/useIsOwner.jsx';
import useEnrollment from '../../../../hooks/enrollmentHooks/useEnrollment.jsx';

export default function EnrollmentPanel({ slug, owner, ltiToken }) {
    const isOwner = useIsOwner({ owner });
    const { students, loading, enrollLoading, fetchStudents, enrollStudent, removeStudent } = useEnrollment(slug);
    const [username, setUsername] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOwner) fetchStudents();
    }, [isOwner, fetchStudents]);

    if (!isOwner) return null;

    const handleAdd = async () => {
        const trimmed = username.trim();
        if (!trimmed) return;
        const ok = await enrollStudent(trimmed);
        if (ok) setUsername('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    const handleCopy = () => {
        if (!ltiToken) return;
        navigator.clipboard.writeText(ltiToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box
            sx={{
                border: '1px solid rgba(108,142,255,0.2)',
                borderRadius: 2,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ fontSize: '1.1rem', color: 'primary.light', opacity: 0.8 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Enrolled Students
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                    {students.length} {students.length === 1 ? 'student' : 'students'}
                </Typography>
            </Box>

            {ltiToken && (
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: 1,
                    px: 1.5, py: 1, borderRadius: 1.5,
                    background: 'rgba(108,142,255,0.06)',
                    border: '1px solid rgba(108,142,255,0.15)',
                }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                            Moodle LTI Token — paste in Custom parameters as <code style={{ opacity: 0.8 }}>course=&lt;token&gt;</code>
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.85, wordBreak: 'break-all' }}>
                            {ltiToken}
                        </Typography>
                    </Box>
                    <Tooltip title={copied ? 'Copied!' : 'Copy token'}>
                        <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? 'success.light' : 'primary.light', flexShrink: 0 }}>
                            <ContentCopyIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    size="small"
                    placeholder="Add student by username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    fullWidth
                    disabled={enrollLoading}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                />
                <IconButton
                    onClick={handleAdd}
                    disabled={enrollLoading || !username.trim()}
                    sx={{
                        border: '1px solid rgba(108,142,255,0.3)',
                        borderRadius: 1.5,
                        color: 'primary.light',
                        '&:hover': { background: 'rgba(108,142,255,0.1)', borderColor: 'primary.main' },
                        flexShrink: 0,
                    }}
                >
                    {enrollLoading ? <CircularProgress size={18} color="inherit" /> : <AddIcon fontSize="small" />}
                </IconButton>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={22} />
                </Box>
            ) : students.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                    No students enrolled yet.
                </Typography>
            ) : (
                <List disablePadding>
                    {students.map((s, i) => (
                        <Box key={s.username}>
                            {i > 0 && <Divider sx={{ opacity: 0.15 }} />}
                            <ListItem disablePadding sx={{ py: 0.75 }}>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {s.username}
                                            </Typography>
                                            {s.lti_source && (
                                                <Chip
                                                    icon={<SchoolIcon sx={{ fontSize: '0.75rem !important' }} />}
                                                    label={s.lti_source}
                                                    size="small"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.65rem',
                                                        fontWeight: 600,
                                                        bgcolor: 'rgba(108,142,255,0.1)',
                                                        color: 'primary.light',
                                                        border: '1px solid rgba(108,142,255,0.25)',
                                                        '& .MuiChip-icon': { color: 'primary.light' },
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={s.enrolled_at ? format(parseISO(s.enrolled_at), 'MMM d, yyyy') : null}
                                    secondaryTypographyProps={{ variant: 'caption', sx: { opacity: 0.5 } }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        size="small"
                                        onClick={() => removeStudent(s.username)}
                                        sx={{
                                            color: 'error.light',
                                            opacity: 0.7,
                                            '&:hover': { opacity: 1, background: 'rgba(244,67,54,0.08)' },
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </Box>
                    ))}
                </List>
            )}
        </Box>
    );
}

