import useIsAllowed from "../../hooks/permissionHooks/useIsAllowed.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import { Helmet } from 'react-helmet-async';
import MainWrapper from "../../components/layout/MainWrapper.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {format, parse} from "date-fns";
import useGetCourseDetail from "../../hooks/courseHooks/useGetCourseDetail.jsx";
import NotFound from "../../components/layout/NotFound.jsx";
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CourseDetailTopics from "./components/topic/CourseDetailTopics.jsx";
import UpdateCourseButton from "./components/course/UpdateCourseButton.jsx";
import DeleteCourseButton from "./components/course/DeleteCourseButton.jsx";
import CertificateButton from "./components/course/CertificateButton.jsx";
import EnrollmentPanel from "./components/course/EnrollmentPanel.jsx";
import useBookmark from "../../hooks/courseHooks/useBookmark.jsx";
import useAuthStore from "../../stores/authStore.jsx";
import CourseFeedbackSection from "./components/course/CourseFeedbackSection.jsx";
import p1 from "../../assets/Group 6.svg";
import p2 from "../../assets/Group 7.svg";
import p3 from "../../assets/Group 8.svg";
import p4 from "../../assets/Group 9.svg";

const PLACEHOLDERS = [p1, p2, p3, p4];


export default function CourseDetailPage(){
    const navigate = useNavigate();
    const { slug } = useParams();
    const { getCourse, loading, error } = useGetCourseDetail();
    const [ course, setCourse ] = useState(null);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const { toggleBookmark, toggling } = useBookmark();
    const isLoggedIn = useAuthStore(s => s.isLoggedIn);

    const FALLBACK_IMAGE = PLACEHOLDERS[(course?.id ?? 0) % PLACEHOLDERS.length];

    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const fetchedPost = await getCourse(slug);
                    if (fetchedPost) {
                        setCourse(fetchedPost);
                        setBookmarked(fetchedPost.is_bookmarked ?? false);
                    } else {
                        setCourse(null);
                    }
                } catch (err) {
                    console.error("Error in fetchPost:", err);
                    setCourse(null);
                }
            };
            fetchPost();
        }
    }, [slug, getCourse, refreshFlag]);

    if (error) return <NotFound sx={{ flexGrow: 1 }} />;

    if (loading || !course) {
        return (
            <MainWrapper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress aria-label="Loading course" />
                </Box>
            </MainWrapper>
        );
    }

    const { title, description, owner, level, featured_image, updated_at, status, lti_token } = course;

    return (
        <MainWrapper>
            <Helmet>
                <title>{title ? `${title} — Erudite` : 'Course — Erudite'}</title>
                <meta name="description" content={description ? description.replace(/<[^>]+>/g, '').slice(0, 155) : `Learn ${title || 'this course'} on Erudite.`} />
            </Helmet>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 1250,
                    mx: 'auto',
                    p: { xs: 2, sm: 3, md: 4 },
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
                role="article"
            >
                {/* ── Header row: meta + actions ── */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {level && (
                            <Box sx={{
                                px: 1.25, py: 0.4, borderRadius: 1,
                                background: 'rgba(108,142,255,0.1)',
                                border: '1px solid rgba(108,142,255,0.2)',
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.light', textTransform: 'capitalize' }}>
                                    {level}
                                </Typography>
                            </Box>
                        )}
                        <Typography variant="caption" color="text.secondary">
                            Updated {format(parse(updated_at, 'dd.MM.yyyy HH:mm', new Date()), 'MMM d, yyyy')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {/* Bookmark — visible to all logged-in users */}
                        {isLoggedIn && (
                            <Tooltip title={bookmarked ? 'Remove bookmark' : 'Bookmark this course'}>
                                <IconButton
                                    size="small"
                                    disabled={toggling}
                                    onClick={() => toggleBookmark({ slug, onToggled: setBookmarked })}
                                    sx={{
                                        color: bookmarked ? 'primary.light' : 'text.secondary',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: 'primary.light' },
                                    }}
                                >
                                    {bookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                                </IconButton>
                            </Tooltip>
                        )}
                        {/* Teacher actions — only visible to owner */}
                        <UpdateCourseButton slug={slug} owner={owner} course={course} onUpdated={() => setRefreshFlag(f => !f)} />
                        <DeleteCourseButton slug={slug} owner={owner} onDeleted={() => navigate(-1)} />
                    </Box>
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}
                >
                    {title || 'Untitled Course'}
                </Typography>

                {featured_image && (
                    <Box sx={{
                        position: 'relative', width: '100%', maxHeight: 420,
                        borderRadius: 2, overflow: 'hidden',
                        '& img': {
                            width: '100%', height: 'auto', objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': { transform: 'scale(1.02)' },
                        },
                    }}>
                        <img
                            src={featured_image || FALLBACK_IMAGE}
                            alt={title || 'Course image'}
                            loading="lazy"
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        />
                    </Box>
                )}

                <Typography
                    variant="body1"
                    sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap', opacity: 0.85 }}
                >
                    {(description || 'No description available').replace(/<[^>]+>/g, '')}
                </Typography>

                <CertificateButton slug={slug} courseTitle={title} />

                {status === 'private' && (
                    <EnrollmentPanel slug={slug} owner={owner} ltiToken={lti_token} />
                )}

                <CourseDetailTopics slug={slug} owner={owner} />

                <CourseFeedbackSection slug={slug} owner={owner} />
            </Box>
        </MainWrapper>
    );
}
