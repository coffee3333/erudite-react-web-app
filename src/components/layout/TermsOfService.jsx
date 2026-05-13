import { useRef } from "react";
import MainWrapper from "./MainWrapper.jsx";
import { Box, Typography, Divider, Link } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import EmailIcon from "@mui/icons-material/Email";

const EFFECTIVE_DATE = "January 1, 2025";

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
                mb: 1.5,
                mt: 0.5,
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

function Section({ title, children }) {
    return (
        <Box
            sx={{
                border: "1px solid rgba(108,142,255,0.12)",
                borderRadius: 3,
                p: 3,
                background: "rgba(108,142,255,0.03)",
            }}
        >
            <SectionHeading>{title}</SectionHeading>
            <Box sx={{ color: "text.secondary", lineHeight: 1.8 }}>{children}</Box>
        </Box>
    );
}

function Para({ children }) {
    return <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 1 }}>{children}</Typography>;
}

export default function TermsOfService() {
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
                    <GavelIcon sx={{ fontSize: "0.8rem", color: "primary.light" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "primary.light", letterSpacing: "0.04em" }}>
                        Legal
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
                    Terms of{" "}
                    <Box component="span" sx={{
                        background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        Service
                    </Box>
                </Typography>

                <Typography
                    sx={{
                        color: "text.secondary", fontSize: "0.9rem",
                        animation: anim("fadeSlideUp", 0.2),
                    }}
                >
                    Effective date: {EFFECTIVE_DATE}
                </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(108,142,255,0.1)", animation: anim("fadeSlideUp", 0.25) }} />

            {/* Sections */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, animation: anim("fadeSlideUp", 0.35) }}>
                <Section title="1. Acceptance of Terms">
                    <Para>
                        By accessing or using the ERUDITE platform ("Service"), you agree to be bound by these Terms
                        of Service. If you do not agree, you may not use the Service.
                    </Para>
                </Section>

                <Section title="2. Use of the Service">
                    <Para>You agree to use ERUDITE only for lawful educational purposes. You must not:</Para>
                    <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                        {[
                            "Attempt to circumvent grading or scoring mechanisms.",
                            "Share account credentials with others.",
                            "Upload content that is offensive, illegal, or infringes third-party rights.",
                            "Interfere with the platform's infrastructure or other users' experience.",
                        ].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 0.75 }}>
                                <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Section>

                <Section title="3. Accounts & Eligibility">
                    <Para>
                        You must be at least 13 years old to create an account. You are responsible for maintaining
                        the security of your account and for all activity that occurs under it.
                    </Para>
                </Section>

                <Section title="4. Intellectual Property">
                    <Para>
                        All course content, challenges, lessons, and materials published on ERUDITE remain the
                        intellectual property of their respective creators. By submitting content, you grant ERUDITE
                        a non-exclusive license to display it within the platform.
                    </Para>
                </Section>

                <Section title="5. Certificates">
                    <Para>
                        Certificates issued by ERUDITE reflect completion of course requirements as tracked by the
                        platform. They are informational only and do not constitute accredited academic credentials
                        unless explicitly stated.
                    </Para>
                </Section>

                <Section title="6. Limitation of Liability">
                    <Para>
                        ERUDITE is provided "as is" without warranties of any kind. To the fullest extent permitted
                        by law, we disclaim liability for any indirect, incidental, or consequential damages arising
                        from your use of the platform.
                    </Para>
                </Section>

                <Section title="7. Changes to Terms">
                    <Para>
                        We may update these Terms at any time. Continued use of the platform after changes
                        constitutes acceptance of the revised Terms. We will notify registered users of significant
                        changes by email.
                    </Para>
                </Section>
            </Box>

            {/* Contact */}
            <Box
                sx={{
                    border: "1px solid rgba(108,142,255,0.15)",
                    borderRadius: 3, p: 3,
                    background: "rgba(108,142,255,0.04)",
                    animation: anim("fadeSlideUp", 0.45),
                }}
            >
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Questions about these Terms?</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EmailIcon sx={{ color: "primary.light", fontSize: "1rem" }} />
                    <Link
                        href="mailto:atai.mamytov@yandex.com"
                        underline="hover"
                        sx={{ color: "primary.light", fontWeight: 500, "&:hover": { color: "primary.main" } }}
                    >
                        atai.mamytov@yandex.com
                    </Link>
                </Box>
            </Box>
        </MainWrapper>
    );
}
