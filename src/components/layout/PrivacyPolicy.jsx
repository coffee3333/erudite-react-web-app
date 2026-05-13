import { useRef } from "react";
import MainWrapper from "./MainWrapper.jsx";
import { Box, Typography, Divider, Link } from "@mui/material";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
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

export default function PrivacyPolicy() {
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
                    <PrivacyTipIcon sx={{ fontSize: "0.8rem", color: "primary.light" }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "primary.light", letterSpacing: "0.04em" }}>
                        Privacy
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
                    Privacy{" "}
                    <Box component="span" sx={{
                        background: "linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}>
                        Policy
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
                <Section title="1. Information We Collect">
                    <Para>When you register or use ERUDITE, we may collect:</Para>
                    <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                        {[
                            "Account information: username, email address, and profile photo.",
                            "Usage data: challenges attempted, scores, and course progress.",
                            "Submitted content: text answers, uploaded photos, and code solutions.",
                            "Technical data: IP address, browser type, and session identifiers.",
                        ].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 0.75 }}>
                                <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Section>

                <Section title="2. How We Use Your Information">
                    <Para>We use collected data to:</Para>
                    <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                        {[
                            "Provide and improve the platform's features and content.",
                            "Authenticate users and maintain account security.",
                            "Display personalised progress, rankings, and certificates.",
                            "Send important account and service notifications.",
                        ].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 0.75 }}>
                                <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Section>

                <Section title="3. Data Sharing">
                    <Para>
                        We do not sell your personal information. Your data may be shared only in the following cases:
                    </Para>
                    <Box component="ul" sx={{ pl: 3, mt: 0.5, mb: 0 }}>
                        {[
                            "With instructors of courses you are enrolled in (name, progress, scores).",
                            "With third-party service providers that help us operate the platform (e.g., cloud storage, email delivery), under strict confidentiality agreements.",
                            "When required by law or to protect the rights of ERUDITE and its users.",
                        ].map((item) => (
                            <Box component="li" key={item} sx={{ mb: 0.75 }}>
                                <Typography sx={{ color: "text.secondary", lineHeight: 1.75 }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Section>

                <Section title="4. Cookies & Local Storage">
                    <Para>
                        ERUDITE uses browser local storage to persist your authentication tokens and user preferences.
                        No third-party advertising cookies are used.
                    </Para>
                </Section>

                <Section title="5. Data Retention">
                    <Para>
                        We retain your account data for as long as your account is active. You may request deletion
                        of your account and associated data at any time by contacting us. Submissions and scores may
                        be retained in anonymised form for platform analytics.
                    </Para>
                </Section>

                <Section title="6. Security">
                    <Para>
                        We implement industry-standard security measures, including JWT-based authentication,
                        HTTPS transport, and access-controlled storage. No method of transmission over the internet
                        is 100% secure; we strive to protect your data but cannot guarantee absolute security.
                    </Para>
                </Section>

                <Section title="7. Children's Privacy">
                    <Para>
                        ERUDITE is not directed to children under 13. We do not knowingly collect personal
                        information from children under 13. If you believe a child has provided us with personal
                        data, please contact us and we will promptly delete it.
                    </Para>
                </Section>

                <Section title="8. Changes to This Policy">
                    <Para>
                        We may update this Privacy Policy from time to time. We will notify you of significant
                        changes by posting a notice on the platform or by email. Your continued use of the Service
                        constitutes acceptance of the updated policy.
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
                <Typography sx={{ fontWeight: 600, mb: 1 }}>Privacy questions or data requests?</Typography>
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
