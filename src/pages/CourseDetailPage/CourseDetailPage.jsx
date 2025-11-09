import useIsAllowed from "../../hooks/permissionHooks/useIsAllowed.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import MainWrapper from "../../components/layout/MainWrapper.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {format, parse} from "date-fns";
import useGetCourseDetail from "../../hooks/courseHooks/useGetCourseDetail.jsx";
import NotFound from "../../components/layout/NotFound.jsx";
import {CircularProgress} from "@mui/material";
import CourseDetailTopics from "./components/topic/CourseDetailTopics.jsx";
import UpdateCourseButton from "./components/course/UpdateCourseButton.jsx";
import DeleteModal from "../../components/common/DeleteModal.jsx";
import DeleteCourseButton from "./components/course/DeleteCourseButton.jsx";
import Container from "@mui/material/Container";


export default function CourseDetailPage(){
    const navigate = useNavigate();
    const { slug } = useParams();
    const { getCourse, isLoading, error } = useGetCourseDetail();
    const [ course, setCourse ] = useState(null);

    const FALLBACK_IMAGE = 'https://res.cloudinary.com/dosmccelh/image/upload/v1749121535/no-image_qkd9dc.png';

    useEffect(() => {
        if (slug) {
            const fetchPost = async () => {
                try {
                    const fetchedPost = await getCourse(slug);
                    if (fetchedPost) {
                        setCourse(fetchedPost);
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
    }, [slug, getCourse]);

    if (error) {
        return (
            <NotFound sx={{ flexGrow: 1 }} />
        );
    }

    if (isLoading || !course) {
        return (
            <MainWrapper>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            </MainWrapper>
        );
    }

    const {
        title,
        description,
        owner,
        language,
        level,
        featured_image,
        created_at,
        updated_at,
    } = course;

    return (
        <MainWrapper>
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
                    gap: 4,
                }}
                role="article"
                aria-labelledby="post-title"
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="caption">
                        {level || 'Untitled Level'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {format(parse(updated_at, 'dd.MM.yyyy HH:mm', new Date()), 'MMM d, yyyy')}
                    </Typography>
                </Box>

                <Typography
                    id="course-title"
                    variant="h6"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        fontSize: { xs: '1.5rem', sm: '1.7rem', md: '2.0rem' },
                    }}
                >
                    {title || 'Untitled Course'}
                </Typography>

                {featured_image && (
                    <Box
                        sx={{
                            position: 'relative',
                            width: '100%',
                            maxHeight: 400,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mt: 2,
                            '& img': {
                                width: '100%',
                                height: 'auto',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': { transform: 'scale(1.02)' },
                            },
                        }}
                    >
                        <img
                            src={featured_image || FALLBACK_IMAGE}
                            alt={title || 'Post image'}
                            loading="lazy"
                            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                        />
                    </Box>
                )}

                <Typography
                    variant="body1"
                    sx={{
                        mt: 2,
                        lineHeight: 1.8,
                        '& p': { mb: 2 },
                        whiteSpace: 'pre-wrap',
                    }}
                    dangerouslySetInnerHTML={{ __html: description || 'No description available' }}
                />

                <Container sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'center', gap: 1 }} fullWidth>
                    <DeleteCourseButton slug={slug} owner={owner} onDeleted={() => navigate(-1)} />
                    <UpdateCourseButton slug={slug} owner={owner} course={course} />

                </Container>

                <CourseDetailTopics slug={slug} owner={owner} />

                {/*{isLoggedIn ? (*/}
                {/*    <PostFooterAuthorized*/}
                {/*        course = {course}*/}
                {/*    />*/}
                {/*) : (*/}
                {/*    <PostFooterNoActions*/}
                {/*        author={author}*/}
                {/*        rating={rating_avg}*/}
                {/*        likes={like_count}*/}
                {/*        nav*/}
                {/*    />*/}
                {/*)}*/}

            </Box>
        </MainWrapper>
    );
}