import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Masonry from "react-masonry-css";
import CourseCard from "../../../components/common/CourseCard.jsx";


export default function CourseContentBody({ allCourses, handleLoadMore, moreAvailable, loading }) {
    const breakpointCols = {
        1300: 3,
        700: 2,
        500: 1,
    };

    if (!allCourses) return null;

    console.log("allCourses", allCourses);

    return (
        <Box sx={{ width: "100%" }}>
            {allCourses.length === 0 && !loading ? (
                <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
                    No posts yet.
                </Typography>
            ) : (
                <Masonry
                    breakpointCols={breakpointCols}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {allCourses.map((course) => (
                        <div key={course.id}>
                            <CourseCard course={course} />
                        </div>
                    ))}
                </Masonry>
            )}

            {moreAvailable && (
                <Button
                    fullWidth
                    size="small"
                    variant="outlined"
                    onClick={handleLoadMore}
                    sx={{ mt: 3, mx: "auto", display: "block" }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={18} sx={{ mr: 1 }} /> : null}
                    Load more
                </Button>
            )}
        </Box>
    )
}