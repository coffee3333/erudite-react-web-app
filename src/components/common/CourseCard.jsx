import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import {useNavigate} from "react-router-dom";
import {format, parse} from "date-fns";
import {styled} from "@mui/material/styles";
import CardMedia from "@mui/material/CardMedia";

const SyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    height: '100%',
    backgroundColor: (theme.vars || theme).palette.background.paper,
    '&:hover': {
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '2px',
    },
}));

const SyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 16,
    flexGrow: 1,
    '&:last-child': {
        paddingBottom: 16,
    },
});

export default function CourseCard({ course }) {
    const FALLBACK_IMAGE = "https://res.cloudinary.com/dosmccelh/image/upload/v1749121535/no-image_qkd9dc.png";
    const navigate = useNavigate();

    return (
        <CardActionArea onClick={() => navigate(`/course/${course.slug}`)}>
            <SyledCard
                variant="outlined"
            >
                {
                    course.featured_image ? (
                            <CardMedia
                                component="img"
                                src={
                                    course.featured_image
                                        ? `${course.featured_image}?f_auto,q_auto`
                                        : FALLBACK_IMAGE
                                }
                                alt={course.title || "Course image"}
                                sx={{
                                    aspectRatio: '16 / 9',
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                }}
                            />
                        ):
                        null
                }
                <SyledCardContent>
                    {/*<Typography gutterBottom variant="caption" component="div">*/}
                    {/*    {course.category.name}*/}
                    {/*</Typography>*/}
                    <Typography gutterBottom variant="h5" component="div" sx={{ mb: 2.5}}>
                        {course.title}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                            {/*<Avatar*/}
                            {/*    alt={course.author.username}*/}
                            {/*    src={course.author?.photo}*/}
                            {/*    sx={{ width: 24, height: 24 }}*/}
                            {/*/>*/}
                            <Typography variant="caption">{course.owner}</Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            {course.created_at
                                ? format(
                                    parse(course.created_at, "dd.MM.yyyy HH:mm", new Date()),
                                    "MMMM d, yyyy"
                                )
                                : "No date available"}
                        </Typography>
                    </Box>
                </SyledCardContent>
            </SyledCard>
        </CardActionArea>
    );
}