import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import MainWrapper from "./MainWrapper.jsx";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";

const keyframes = `
@keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
}
`;

export default function NotFound() {
    const navigate = useNavigate();
    const prefersReducedMotion = useRef(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current;

    const anim = (name, delay) =>
        prefersReducedMotion ? "none" : `${name} 0.7s ease ${delay}s both`;

    return (
        <MainWrapper>
            <style>{keyframes}</style>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    py: { xs: 6, sm: 10 },
                    gap: 0,
                }}
            >
                {/* Big 404 */}
                <Box
                    sx={{
                        animation: prefersReducedMotion ? "none" : "float 4s ease-in-out infinite",
                        mb: 2,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: "clamp(6rem, 20vw, 11rem)",
                            fontWeight: 800,
                            letterSpacing: "-0.05em",
                            lineHeight: 1,
                            background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 60%, #6C8EFF 100%)",
                            backgroundSize: "200% auto",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            animation: prefersReducedMotion
                                ? "none"
                                : "fadeSlideDown 0.7s ease 0s both",
                            userSelect: "none",
                        }}
                    >
                        404
                    </Typography>
                </Box>

                {/* Headline */}
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        mb: 1.5,
                        animation: anim("fadeSlideUp", 0.15),
                    }}
                >
                    Page not found
                </Typography>

                {/* Subtitle */}
                <Typography
                    sx={{
                        color: "text.secondary",
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        maxWidth: 420,
                        mb: 4,
                        animation: anim("fadeSlideUp", 0.25),
                    }}
                >
                    The page you're looking for doesn't exist or has been moved.
                </Typography>

                {/* Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                        justifyContent: "center",
                        animation: anim("fadeSlideUp", 0.35),
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<HomeIcon />}
                        onClick={() => navigate("/")}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            background: "linear-gradient(135deg, #6C8EFF, #B06EFF)",
                            "&:hover": { opacity: 0.9 },
                        }}
                    >
                        Go home
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SchoolIcon />}
                        onClick={() => navigate("/courses")}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            borderColor: "rgba(108,142,255,0.35)",
                            color: "primary.light",
                            "&:hover": {
                                borderColor: "primary.main",
                                background: "rgba(108,142,255,0.08)",
                            },
                        }}
                    >
                        Browse courses
                    </Button>
                </Box>
            </Box>
        </MainWrapper>
    );
}
