import { createRoot } from 'react-dom/client'
import CssBaseline from "@mui/material/CssBaseline";
import { useEffect } from 'react';
import './styles/index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ColorModeProvider, useColorMode } from './stores/colorModeStore.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import apiClient from './api/apiClient.jsx';
import useAuthStore from './stores/authStore.jsx';

// ── Palette tokens ────────────────────────────────────────────────────────────
const PRIMARY   = { main: '#6C8EFF', light: '#92AAFF', dark: '#4A6AE0' };
const SECONDARY = { main: '#B06EFF', light: '#C990FF', dark: '#8A4ECC' };
const SUCCESS   = { main: '#4CAF50', light: '#81C784' };
const WARNING   = { main: '#FFB74D', light: '#FFD080' };
const ERROR     = { main: '#F44336', light: '#EF9A9A' };

const DARK_BG   = { default: '#0D0F1A', paper: '#13162A' };
const LIGHT_BG  = { default: '#F0F2FA', paper: '#FFFFFF' };

const DARK_TEXT  = { primary: '#E8EAFF', secondary: '#8B90B8' };
const LIGHT_TEXT = { primary: '#12153A', secondary: '#5A607A' };

// ── Theme factory ─────────────────────────────────────────────────────────────
function getTheme(mode) {
    const isDark = mode === 'dark';

    // Shared accent opacity helpers – adapt to mode
    const p = (a) => `rgba(108,142,255,${a})`;   // primary
    const s = (a) => `rgba(176,110,255,${a})`;   // secondary
    const neutral = (a) => isDark
        ? `rgba(255,255,255,${a})`
        : `rgba(18,21,58,${a})`;                 // dark base in light mode

    return createTheme({
        palette: {
            mode,
            primary:   PRIMARY,
            secondary: SECONDARY,
            success:   SUCCESS,
            warning:   WARNING,
            error:     ERROR,
            background: isDark ? DARK_BG : LIGHT_BG,
            text: isDark ? DARK_TEXT : LIGHT_TEXT,
            divider: p(0.12),
        },
        typography: {
            fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            h1: { fontWeight: 800, letterSpacing: '-0.02em' },
            h2: { fontWeight: 700, letterSpacing: '-0.01em' },
            h3: { fontWeight: 700, letterSpacing: '-0.01em' },
            h4: { fontWeight: 700, letterSpacing: '-0.01em' },
            h5: { fontWeight: 600 },
            h6: { fontWeight: 600 },
            body1: { fontSize: '0.9375rem', lineHeight: 1.7 },
            body2: { fontSize: '0.875rem',  lineHeight: 1.6 },
            caption: { fontSize: '0.75rem', letterSpacing: '0.01em' },
            overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em' },
            button:  { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
        },
        shape: { borderRadius: 12 },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: { backgroundImage: 'none', backgroundColor: 'transparent', boxShadow: 'none' },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 8, textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
                    containedPrimary: {
                        background: 'linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)',
                        boxShadow: `0 4px 15px ${p(0.3)}`,
                        color: '#fff',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #7A9CFF 0%, #BD80FF 100%)',
                            boxShadow: `0 6px 20px ${p(0.45)}`,
                        },
                    },
                    textPrimary: {
                        color: PRIMARY.light,
                        '&:hover': { background: p(0.08) },
                    },
                    outlinedPrimary: {
                        borderColor: p(0.35),
                        '&:hover': { background: p(0.06), borderColor: PRIMARY.main },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: { borderRadius: 8, transition: 'background 0.15s' },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                        backgroundColor: isDark ? '#13162A' : '#FFFFFF',
                        border: `1px solid ${p(0.1)}`,
                        transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.2s',
                        '&:hover': {
                            borderColor: p(0.3),
                            boxShadow: `0 8px 32px ${p(0.12)}`,
                            transform: 'translateY(-2px)',
                        },
                    },
                },
            },
            MuiChip: {
                styleOverrides: {
                    root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        fontSize: '0.875rem',
                        backgroundColor: isDark ? p(0.04) : p(0.03),
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: p(0.18) },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: p(0.4) },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY.main, borderWidth: 1 },
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        fontSize: '0.875rem',
                        color: isDark ? '#8B90B8' : '#5A607A',
                        '&.Mui-focused': { color: PRIMARY.light },
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        fontSize: '0.875rem', fontWeight: 500,
                        borderRadius: 6, margin: '2px 4px', padding: '8px 12px',
                        '&:hover': { background: p(0.08) },
                        '&.Mui-selected': {
                            background: p(0.12),
                            '&:hover': { background: p(0.16) },
                        },
                    },
                },
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDark ? '#1A1E35' : '#FFFFFF',
                        border: `1px solid ${p(0.15)}`,
                        borderRadius: 10,
                        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(18,21,58,0.12)',
                        backgroundImage: 'none',
                    },
                },
            },
            MuiDrawer: {
                styleOverrides: {
                    paper: {
                        backgroundColor: isDark ? '#13162A' : '#FFFFFF',
                        backgroundImage: 'none',
                        borderBottom: `1px solid ${p(0.12)}`,
                    },
                },
            },
            MuiAvatar: {
                styleOverrides: {
                    root: {
                        fontSize: '0.875rem', fontWeight: 700,
                        background: 'linear-gradient(135deg, #6C8EFF 0%, #B06EFF 100%)',
                        color: '#fff',
                        border: `2px solid ${p(0.25)}`,
                    },
                },
            },
            MuiDivider: {
                styleOverrides: {
                    root: { borderColor: p(0.12) },
                },
            },
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundImage: 'none',
                        backgroundColor: isDark ? '#13162A' : '#FFFFFF',
                        border: `1px solid ${p(0.12)}`,
                        borderRadius: 14,
                    },
                },
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        fontSize: '0.75rem', fontWeight: 500,
                        backgroundColor: isDark ? '#1A1E35' : '#12153A',
                        border: `1px solid ${p(0.2)}`,
                        borderRadius: 6,
                        color: '#fff',
                    },
                    arrow: { color: isDark ? '#1A1E35' : '#12153A' },
                },
            },
            MuiLinearProgress: {
                styleOverrides: {
                    root: { borderRadius: 4, backgroundColor: p(0.12) },
                },
            },
            MuiAlert: {
                styleOverrides: {
                    root: { borderRadius: 8, fontSize: '0.875rem' },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: { backgroundImage: 'none' },
                },
            },
            MuiCircularProgress: {
                defaultProps: { size: 24 },
            },
        },
    });
}

// ── Themed root — reads mode from context ─────────────────────────────────────
function ThemedApp() {
    const { mode } = useColorMode();
    const theme = getTheme(mode);
    const { accessToken, setUser } = useAuthStore();

    // Refresh user profile on every app load so email_verified and other
    // fields are always up-to-date (not stale from localStorage).
    useEffect(() => {
        if (!accessToken) return;
        apiClient.get('/users/profile/me/').then(setUser).catch(() => {});
    }, [accessToken]);

    // Sync body attribute so index.css grid adapts
    document.documentElement.setAttribute('data-color-mode', mode);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline enableColorScheme />
            <App />
        </ThemeProvider>
    );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AppTree = (
    <ColorModeProvider>
        <ThemedApp />
    </ColorModeProvider>
);

createRoot(document.getElementById('root')).render(
    googleClientId
        ? <GoogleOAuthProvider clientId={googleClientId}>{AppTree}</GoogleOAuthProvider>
        : AppTree
);
