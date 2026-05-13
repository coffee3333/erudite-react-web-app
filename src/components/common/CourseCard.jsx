import { memo } from "react";
import { Box, Card, CardContent, LinearProgress, Typography, Tooltip, IconButton, Chip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { format, parse } from "date-fns";
import { styled } from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";
import courseService from "../../api/endpoints/courseService.jsx";
import p1 from "../../assets/Group 6.svg";
import p2 from "../../assets/Group 7.svg";
import p3 from "../../assets/Group 8.svg";
import p4 from "../../assets/Group 9.svg";
import useInView, { prefersReducedMotion } from "../../hooks/useInView.jsx";

const PLACEHOLDERS = [p1, p2, p3, p4];

const StyledCard = styled(Card)(() => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    overflow: 'hidden',
    cursor: 'pointer',
    '&:hover .course-card-img': {
        transform: 'scale(1.04)',
    },
}));

const ImageWrapper = styled(Box)({
    position: 'relative',
    overflow: 'hidden',
    '& img': {
        transition: 'transform 0.4s ease',
    },
});

export default memo(function CourseCard({ course, index = 0 }) {
    const [ref, inView] = useInView();
    const FALLBACK_IMAGE = PLACEHOLDERS[(course.id ?? 0) % PLACEHOLDERS.length];
    const navigate = useNavigate();

    const completion = course.completion_pct ?? null;
    const certificate = course.certificate ?? null;

    const handleDownload = async (e) => {
        e.stopPropagation();
        try {
            const blob = await courseService.downloadCertificate({ slug: course.slug });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `certificate-${course.slug}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            // silently ignore
        }
    };

    return (
        <Box
            ref={ref}
            onClick={() => navigate(`/course/${course.slug}`)}
            sx={{
                height: '100%',
                opacity: prefersReducedMotion ? 1 : (inView ? 1 : 0),
                transform: prefersReducedMotion ? 'none' : (inView ? 'translateY(0)' : 'translateY(24px)'),
                transition: prefersReducedMotion
                    ? 'none'
                    : `opacity 0.55s ease ${(index % 6) * 80}ms, transform 0.55s ease ${(index % 6) * 80}ms`,
            }}
        >
            <StyledCard variant="outlined">
                <ImageWrapper>
                    <CardMedia
                        component="img"
                        className="course-card-img"
                        src={course.featured_image ? `${course.featured_image}?f_auto,q_auto` : FALLBACK_IMAGE}
                        alt={course.title || "Course image"}
                        loading="lazy"
                        sx={{ aspectRatio: '16 / 9', width: '100%', objectFit: 'cover' }}
                    />
                    {completion !== null && completion >= 100 && (
                        <Box sx={{
                            position: 'absolute', top: 10, right: 10,
                            background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                            borderRadius: '20px', px: 1.5, py: 0.5,
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            boxShadow: '0 2px 8px rgba(76,175,80,0.5)',
                        }}>
                            <EmojiEventsIcon sx={{ fontSize: '0.85rem', color: '#fff' }} />
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                                Completed
                            </Typography>
                        </Box>
                    )}
                    {course.status === 'private' && (
                        <Box sx={{
                            position: 'absolute', top: 10, left: 10,
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(4px)',
                            borderRadius: '20px', px: 1, py: 0.4,
                            display: 'flex', alignItems: 'center', gap: 0.5,
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}>
                            <LockIcon sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }} />
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em' }}>
                                Private
                            </Typography>
                        </Box>
                    )}
                </ImageWrapper>

                <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            lineHeight: 1.35,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {course.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                        <Box sx={{
                            width: 24, height: 24, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <SchoolIcon sx={{ fontSize: '0.8rem', color: '#fff' }} />
                        </Box>
                        <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 500 }}>
                            {course.owner}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.45, ml: 'auto' }}>
                            {course.created_at
                                ? format(parse(course.created_at, "dd.MM.yyyy HH:mm", new Date()), "MMM d, yyyy")
                                : ""}
                        </Typography>
                    </Box>

                    {completion !== null && (
                        <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 500 }}>
                                    Progress
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Chip
                                        label={`${Math.round(completion)}%`}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.68rem',
                                            fontWeight: 700,
                                            background: completion >= 100
                                                ? 'rgba(76,175,80,0.2)'
                                                : 'rgba(108,142,255,0.15)',
                                            color: completion >= 100 ? 'success.light' : 'primary.light',
                                            border: `1px solid ${completion >= 100 ? 'rgba(76,175,80,0.3)' : 'rgba(108,142,255,0.25)'}`,
                                        }}
                                    />
                                    {certificate && (
                                        <Tooltip title="Download your certificate" arrow>
                                            <IconButton
                                                size="small"
                                                onClick={handleDownload}
                                                aria-label="Download certificate"
                                                sx={{
                                                    width: 24, height: 24,
                                                    background: 'linear-gradient(135deg, rgba(255,183,77,0.2), rgba(255,183,77,0.1))',
                                                    border: '1px solid rgba(255,183,77,0.3)',
                                                    color: 'warning.light',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, rgba(255,183,77,0.35), rgba(255,183,77,0.2))',
                                                        transform: 'scale(1.1)',
                                                    },
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                <DownloadIcon sx={{ fontSize: '0.8rem' }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={completion}
                                aria-label={`Course progress: ${Math.round(completion)}%`}
                                sx={{
                                    height: 4,
                                    '& .MuiLinearProgress-bar': {
                                        background: completion >= 100
                                            ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                                            : 'linear-gradient(90deg, #6C8EFF, #B06EFF)',
                                    },
                                }}
                            />
                        </Box>
                    )}
                </CardContent>
            </StyledCard>
        </Box>
    );
});
