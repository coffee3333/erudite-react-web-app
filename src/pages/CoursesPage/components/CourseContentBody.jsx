import { Box, Button, CircularProgress, Skeleton, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import CourseCard from "../../../components/common/CourseCard.jsx";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const breakpointCols = {
    default: 3,
    1100: 2,
    640: 1,
};

function CourseCardSkeleton() {
    return (
        <Box sx={{
            borderRadius: 2, overflow: 'hidden',
            border: '1px solid rgba(108,142,255,0.1)',
            background: '#13162A',
        }}>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '16/9', width: '100%' }} animation="wave" />
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, minHeight: 110 }}>
                <Skeleton variant="text" width="80%" height={24} animation="wave" />
                <Skeleton variant="text" width="50%" height={16} animation="wave" />
                <Skeleton variant="rectangular" height={4} sx={{ borderRadius: 2, mt: 1 }} animation="wave" />
            </Box>
        </Box>
    );
}

export default function CourseContentBody({ allCourses, handleLoadMore, moreAvailable, loading }) {
    if (!allCourses) return null;

    const showSkeletons = loading && allCourses.length === 0;

    if (showSkeletons) {
        return (
            <Masonry breakpointCols={breakpointCols} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i}><CourseCardSkeleton /></div>
                ))}
            </Masonry>
        );
    }

    if (allCourses.length === 0 && !loading) {
        return (
            <Box sx={{ textAlign: 'center', py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <AutoAwesomeIcon sx={{ fontSize: '3rem', opacity: 0.2 }} />
                <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>
                    No courses found. Try a different search.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Masonry
                breakpointCols={breakpointCols}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {allCourses.map((course, i) => (
                    <div key={course.id}>
                        <CourseCard course={course} index={i} />
                    </div>
                ))}
            </Masonry>

            {moreAvailable && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={handleLoadMore}
                        disabled={loading}
                        sx={{
                            px: 4, borderRadius: 2,
                            borderColor: 'rgba(108,142,255,0.3)',
                            color: 'primary.light',
                            '&:hover': { borderColor: 'primary.main', background: 'rgba(108,142,255,0.08)' },
                        }}
                        startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
                    >
                        {loading ? 'Loading…' : 'Load more'}
                    </Button>
                </Box>
            )}
        </Box>
    );
}
