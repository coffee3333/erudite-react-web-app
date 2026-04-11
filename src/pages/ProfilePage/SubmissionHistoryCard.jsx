import React from 'react';
import {
    Card, CardContent, Typography, Box, Chip, Stack, Divider,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
    passed: { label: 'Passed', color: 'success', icon: <CheckCircleOutlineIcon fontSize="small" /> },
    failed: { label: 'Failed', color: 'error', icon: <CancelOutlinedIcon fontSize="small" /> },
    pending: { label: 'Pending', color: 'warning', icon: <HourglassEmptyIcon fontSize="small" /> },
};

const SubmissionHistoryCard = ({ activities = [] }) => {
    const navigate = useNavigate();

    if (!activities || activities.length === 0) {
        return (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                    <Typography color="text.secondary" align="center">
                        No recent activity yet.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Recent Activity
                </Typography>
                <Stack divider={<Divider flexItem />} spacing={1.5}>
                    {activities.map((item, i) => {
                        const cfg = statusConfig[item.status] || { label: item.status, color: 'default', icon: null };
                        return (
                            <Box
                                key={i}
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                      cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                                onClick={() => navigate(`/courses/${item.course_slug || ''}/topics/${item.topic_slug}/challenges`)}
                            >
                                <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                        {item.challenge_title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.course_title}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="body2" fontWeight={600}>
                                        +{item.score} pts
                                    </Typography>
                                    <Chip
                                        size="small"
                                        label={cfg.label}
                                        color={cfg.color}
                                        icon={cfg.icon}
                                    />
                                </Box>
                            </Box>
                        );
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
};

export default SubmissionHistoryCard;
