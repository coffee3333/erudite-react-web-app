import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import AppBar from "./AppBar.jsx";
import Footer from "./Footer.jsx";
import * as React from "react";
import { useLocation } from "react-router-dom";
import { prefersReducedMotion } from "../../hooks/useInView.jsx";

export default function MainWrapper ({ children }) {
    const { pathname } = useLocation();

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
            <a
                href="#main-content"
                style={{
                    position: 'absolute',
                    top: -9999,
                    left: -9999,
                    zIndex: 9999,
                    padding: '8px 16px',
                    background: '#6C8EFF',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '0 0 8px 8px',
                    textDecoration: 'none',
                }}
                onFocus={(e) => { e.currentTarget.style.top = '0'; e.currentTarget.style.left = '50%'; e.currentTarget.style.transform = 'translateX(-50%)'; }}
                onBlur={(e) => { e.currentTarget.style.top = '-9999px'; e.currentTarget.style.left = '-9999px'; e.currentTarget.style.transform = ''; }}
            >
                Skip to main content
            </a>
            <AppBar />
            <Container
                id="main-content"
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', mt: 12, mb: 5 }}
            >
                <Box
                    key={pathname}
                    sx={{
                        display: 'flex', flexDirection: 'column', gap: 4,
                        animation: prefersReducedMotion ? 'none' : 'pageFadeIn 0.35s ease both',
                        '@keyframes pageFadeIn': {
                            from: { opacity: 0, transform: 'translateY(12px)' },
                            to:   { opacity: 1, transform: 'translateY(0)' },
                        },
                    }}
                >
                    {children}
                </Box>
            </Container>
            <Footer />
        </Container>
    )
}