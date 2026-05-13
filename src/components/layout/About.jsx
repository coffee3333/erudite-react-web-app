import { useRef } from "react";
import MainWrapper from "./MainWrapper.jsx";
import {
    Box, Typography, Link, Divider,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SchoolIcon from "@mui/icons-material/School";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import GroupIcon from "@mui/icons-material/Group";
import BarChartIcon from "@mui/icons-material/BarChart";
import EmailIcon from "@mui/icons-material/Email";

const features = [
    {
        icon: <SchoolIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Challenge-based learning",
        desc: "Instead of passive reading, students actively solve tasks, write explanations, and develop real understanding.",
    },
    {
        icon: <BarChartIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Structured course design",
        desc: "Authors can create courses, modules, and multiple challenge types — from text tasks to photo submissions.",
    },
    {
        icon: <EmojiEventsIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Transparent ranking & progress",
        desc: "Points, difficulty rating, and completed challenges give students a clear view of their achievements.",
    },
    {
        icon: <SpeedIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Modern and intuitive interface",
        desc: "A clean, responsive UI built with React & MUI ensures a smooth experience across all devices.",
    },
    {
        icon: <SecurityIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Secure and reliable",
        desc: "We use JWT authentication, role-based permissions, and strong backend validation to keep learning safe.",
    },
    {
        icon: <GroupIcon sx={{ color: "primary.light", fontSize: "1.3rem" }} />,
        title: "Community features",
        desc: "Comments, moderation tools, and collaboration options help maintain a productive learning environment.",
    },
];

const keyframes = `
@keyframes fadeSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
}
`;

function SectionHeading({ children }) {
    return (
        <Typography
            variant="h5"
            component="h2"
            sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
            }}
        >
            {children}
        </Typography>
    );
}

function Card({ children, sx }) {
    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: "rgba(108,142,255,0.15)",
                borderRadius: 3,
                p: 3,
                background: "rgba(108,142,255,0.04)",
                ...sx,
            }}
        >
            {children}
        </Box>
    );
}

export default function AboutProject() {
    const prefersReducedMotion = useRef(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current;

    const anim = (name, delay) =>
        prefersReducedMotion ? "none" : `${name} 0.7s ease ${delay}s both`;

    return (
        <MainWrapper>
            <style>{keyframes}</style>

            {/* Hero */}
            <Box sx={{ textAlign: "center", py: { xs: 4, sm: 6 } }}>
                <Box
                    sx={{
                        display: "inline-flex", alignItems: "center", gap: 0.75,
                        px: 1.5, py: 0.6, borderRadius: "20px",
                        background: "rgba(108,142,255,0.1)",
                        border: "1px solid rgba(108,142,255,0.2)",
                        mb: 3,
                        animation: anim("fadeSlideDown", 0),
                    }}
                >
                    <AutoAwesomeIcon sx={{ fontSize: "0.8rem", color: "primary.light" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "primary.light", letterSpacing: "0.04em" }}>
                        About the Platform
                    </Typography>
                </Box>

                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15,
                        fontSize: "clamp(2rem, 6vw, 3rem)",
                        mb: 2,
                        animation: anim("fadeSlideUp", 0.1),
                    }}
                >
                    About{" "}
                    <Box component="span" sx={{
                        background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        ERUDITE
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.7,
                        maxWidth: 600, mx: "auto",
                        animation: anim("fadeSlideUp", 0.2),
                    }}
                >
                    An interactive learning platform built around challenge-based education.
                    Our goal is to help students learn through practice, receive meaningful feedback,
                    and track their real progress — while giving instructors simple tools to create
                    structured learning experiences.
                </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(108,142,255,0.1)", animation: anim("fadeSlideUp", 0.25) }} />

            {/* Our Vision */}
            <Box sx={{ animation: anim("fadeSlideUp", 0.3) }}>
                <Card>
                    <SectionHeading>Our Vision</SectionHeading>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                        We believe learning becomes more effective when students actively engage with the material.
                        ERUDITE aims to transform education by providing an environment where users solve challenges,
                        explain their thought process, and continuously grow through transparent feedback and a
                        motivating ranking system.
                    </Typography>
                </Card>
            </Box>

            {/* What Makes ERUDITE Unique */}
            <Box sx={{ animation: anim("fadeSlideUp", 0.38) }}>
                <SectionHeading>What Makes ERUDITE Unique?</SectionHeading>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                }}>
                    {features.map(({ icon, title, desc }) => (
                        <Box
                            key={title}
                            sx={{
                                display: "flex", gap: 2, alignItems: "flex-start",
                                p: 2.5, borderRadius: 2,
                                border: "1px solid rgba(108,142,255,0.12)",
                                background: "rgba(108,142,255,0.03)",
                                transition: "border-color 0.2s",
                                "&:hover": { borderColor: "rgba(108,142,255,0.3)" },
                            }}
                        >
                            <Box sx={{
                                mt: 0.25, p: 1, borderRadius: 1.5,
                                background: "rgba(108,142,255,0.1)",
                                flexShrink: 0,
                            }}>
                                {icon}
                            </Box>
                            <Box>
                                <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{title}</Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.65 }}>{desc}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Meet the Team */}
            <Box sx={{ animation: anim("fadeSlideUp", 0.45) }}>
                <Card>
                    <SectionHeading>Meet the Team</SectionHeading>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                        ERUDITE is developed by a small, dedicated team of students passionate about innovation,
                        education, and modern web technologies. We focus on building an accessible, reliable, and
                        motivating platform that supports both learners and instructors.
                    </Typography>
                </Card>
            </Box>

            {/* Contact */}
            <Box sx={{ animation: anim("fadeSlideUp", 0.52) }}>
                <Card>
                    <SectionHeading>Contact</SectionHeading>
                    <Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
                        Have questions, suggestions, or feedback?
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                        <EmailIcon sx={{ color: "primary.light", fontSize: "1rem" }} />
                        <Link
                            href="mailto:atai.mamytov@yandex.com"
                            underline="hover"
                            sx={{
                                color: "primary.light",
                                fontWeight: 500,
                                "&:hover": { color: "primary.main" },
                            }}
                        >
                            atai.mamytov@yandex.com
                        </Link>
                    </Box>
                </Card>
            </Box>
        </MainWrapper>
    );
}
