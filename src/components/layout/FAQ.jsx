import * as React from "react";
import { useRef } from "react";
import MainWrapper from "./MainWrapper.jsx";
import {
    Box,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Link,
    Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link as RouterLink } from "react-router-dom";

const faqs = [
    {
        q: "How do I create an account?",
        a: <>
            To get started, go to{" "}
            <Link component={RouterLink} to="/sign-up" sx={{ color: "primary.light" }}>
                Sign Up
            </Link>{" "}
            and create your account using your email and password.
            After registering, you can immediately enroll in courses and begin solving challenges.
        </>,
    },
    {
        q: "How do I enroll in a course?",
        a: <>
            Navigate to the{" "}
            <Link component={RouterLink} to="/courses" sx={{ color: "primary.light" }}>
                Courses
            </Link>{" "}
            page and open a course you want to join.{" "}
            <strong>Published</strong> courses are open to everyone — simply visit the course page and start exploring its topics and challenges right away.{" "}
            <strong>Private</strong> courses require the course owner to add you by username.
            Contact the instructor and ask them to enroll you.
        </>,
    },
    {
        q: "How do I solve and submit a challenge?",
        a: <>
            Open any challenge inside a course topic. Depending on the challenge type (text, photo upload, or
            multiple choice), complete the required fields and press <strong>Submit</strong>. You may see your
            score instantly or wait for instructor review if manual grading is required.
        </>,
    },
    {
        q: "Can I resubmit a challenge if I make a mistake?",
        a: "Most challenges allow multiple attempts unless the instructor limits them. If attempts are limited, the platform will notify you how many retries remain.",
    },
    {
        q: "How does the ranking system work?",
        a: "When you complete challenges, you earn points based on difficulty and correctness. Points contribute to your position on the course leaderboard. Ranking motivates students and helps visualize progress.",
    },
    {
        q: "I am an instructor. How do I create courses or challenges?",
        a: <>
            Instructors can create courses, topics, and challenges from the{" "}
            <Link component={RouterLink} to="/my-profile" sx={{ color: "primary.light" }}>
                Dashboard
            </Link>
            . You can design challenge types, set difficulty, schedule availability, and review student submissions.
        </>,
    },
    {
        q: "How do I reset my password?",
        a: <>
            Visit the{" "}
            <Link component={RouterLink} to="/forgot-password" sx={{ color: "primary.light" }}>
                Forgot Password
            </Link>{" "}
            page, enter your email, and follow the instructions.
            You will receive a link to create a new password securely.
        </>,
    },
    {
        q: "Can I comment on challenges or ask questions?",
        a: "Yes! Every challenge includes a comments section. Students can ask questions, and instructors or other students can reply. Moderators can remove inappropriate comments.",
    },
    {
        q: "Is my data secure?",
        a: "Yes — ERUDITE uses modern security standards, including JWT authentication, password hashing, and protected REST endpoints. User files such as photos are securely stored using external media storage.",
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

export default function FAQ() {
    const [expanded, setExpanded] = React.useState(false);
    const prefersReducedMotion = useRef(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ).current;

    const anim = (name, delay) =>
        prefersReducedMotion ? "none" : `${name} 0.7s ease ${delay}s both`;

    const handleChange = (panel) => (_, isExpanded) =>
        setExpanded(isExpanded ? panel : false);

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
                    <HelpOutlineIcon sx={{ fontSize: "0.8rem", color: "primary.light" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "primary.light", letterSpacing: "0.04em" }}>
                        Help Center
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
                    Frequently Asked{" "}
                    <Box component="span" sx={{
                        background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        Questions
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        color: "text.secondary", fontSize: "1.05rem", lineHeight: 1.7,
                        maxWidth: 520, mx: "auto",
                        animation: anim("fadeSlideUp", 0.2),
                    }}
                >
                    Everything you need to know about using ERUDITE. Can't find the answer you're looking for?{" "}
                    <Link href="mailto:atai.mamytov@yandex.com" underline="hover" sx={{ color: "primary.light" }}>
                        Contact us.
                    </Link>
                </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(108,142,255,0.1)", animation: anim("fadeSlideUp", 0.25) }} />

            {/* Accordion list */}
            <Box
                sx={{
                    display: "flex", flexDirection: "column", gap: 1.5, pb: 4,
                    animation: anim("fadeSlideUp", 0.35),
                }}
            >
                {faqs.map((item, idx) => (
                    <Accordion
                        key={idx}
                        expanded={expanded === idx}
                        onChange={handleChange(idx)}
                        disableGutters
                        elevation={0}
                        sx={{
                            border: "1px solid",
                            borderColor: expanded === idx ? "rgba(108,142,255,0.35)" : "rgba(108,142,255,0.12)",
                            borderRadius: "12px !important",
                            background: expanded === idx
                                ? "rgba(108,142,255,0.06)"
                                : "rgba(108,142,255,0.02)",
                            transition: "border-color 0.2s, background 0.2s",
                            "&:before": { display: "none" },
                            overflow: "hidden",
                        }}
                    >
                        <AccordionSummary
                            expandIcon={
                                <ExpandMoreIcon sx={{
                                    color: expanded === idx ? "primary.light" : "text.secondary",
                                    transition: "color 0.2s",
                                }} />
                            }
                            sx={{ px: 3, py: 1.5 }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: "0.97rem" }}>
                                {item.q}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 3, pb: 2.5, color: "text.secondary", lineHeight: 1.75 }}>
                            {item.a}
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </MainWrapper>
    );
}
