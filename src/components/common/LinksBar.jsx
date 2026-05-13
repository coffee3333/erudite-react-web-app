import Box from "@mui/material/Box";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "./Logo.jsx";

const NAV_LINKS = [
    { label: 'Courses',       path: '/courses' },
    { label: 'About Project', path: '/about-project' },
    { label: 'FAQ',           path: '/faq' },
];

function NavLink({ label, path, active }) {
    const navigate = useNavigate();

    return (
        <Box
            component="button"
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
            sx={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                px: 1.5,
                py: 0.75,
                mx: 0.25,
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                color: active ? 'text.primary' : 'text.secondary',
                transition: 'color 0.18s ease, background 0.18s ease',

                '&:hover': {
                    color: 'text.primary',
                    background: 'rgba(108, 142, 255, 0.08)',
                },

                // animated underline
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                    transformOrigin: 'center',
                    width: '60%',
                    height: '2px',
                    borderRadius: '2px',
                    background: 'linear-gradient(90deg, #6C8EFF, #B06EFF)',
                    transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                },

                '&:hover::after': {
                    transform: 'translateX(-50%) scaleX(1)',
                },
            }}
        >
            {label}
        </Box>
    );
}

export default function LinksBar() {
    const location = useLocation();

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Logo />
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', ml: 0.5 }}>
                {NAV_LINKS.map(({ label, path }) => (
                    <NavLink
                        key={path}
                        label={label}
                        path={path}
                        active={location.pathname === path}
                    />
                ))}
            </Box>
        </Box>
    );
}
