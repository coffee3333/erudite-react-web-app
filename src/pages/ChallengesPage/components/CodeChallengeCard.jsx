// CodeChallengeCard.jsx
import * as React from 'react';
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
    Box, Button, CircularProgress, Alert,
    Typography, Chip, Collapse,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TerminalIcon from '@mui/icons-material/Terminal';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import useSubmitChallenge from '../../../hooks/challengeHooks/useSubmitChallenge.jsx';
import useRunCode from '../../../hooks/challengeHooks/useRunCode.jsx';
import useAuthStore from '../../../stores/authStore.jsx';
import { useNavigate } from 'react-router-dom';
import HintSolutionBar from './HintSolutionBar.jsx';

// Map challenge language names to Monaco language IDs
const MONACO_LANG = {
    python: 'python',
    javascript: 'javascript',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
};

const STATUS_STYLES = {
    accepted:          { bg: 'rgba(76,175,80,0.15)',   color: '#81C784', border: 'rgba(76,175,80,0.3)' },
    wrong_answer:      { bg: 'rgba(244,67,54,0.12)',   color: '#EF9A9A', border: 'rgba(244,67,54,0.3)' },
    time_limit:        { bg: 'rgba(255,183,77,0.12)',  color: '#FFD080', border: 'rgba(255,183,77,0.3)' },
    memory_limit:      { bg: 'rgba(255,183,77,0.12)',  color: '#FFD080', border: 'rgba(255,183,77,0.3)' },
    runtime_error:     { bg: 'rgba(244,67,54,0.12)',   color: '#EF9A9A', border: 'rgba(244,67,54,0.3)' },
    compilation_error: { bg: 'rgba(244,67,54,0.12)',   color: '#EF9A9A', border: 'rgba(244,67,54,0.3)' },
};

function TestResultRow({ r, index }) {
    const s = STATUS_STYLES[r.status] || STATUS_STYLES.wrong_answer;
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1, py: 0.5, px: 1,
            borderRadius: 1, background: s.bg, border: `1px solid ${s.border}`,
            mb: 0.5,
        }}>
            <Chip
                label={r.status.replace(/_/g, ' ')}
                size="small"
                sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, background: 'transparent', color: s.color, border: `1px solid ${s.border}` }}
            />
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.72rem' }}>
                Test {index + 1}
                {r.stdin != null ? ` · in: "${r.stdin}"` : ''}
                {r.expected != null ? ` · expected: "${r.expected}"` : ''}
                {r.got != null ? ` · got: "${r.got}"` : ''}
                {r.time_ms != null ? ` · ${r.time_ms.toFixed(1)}ms` : ''}
            </Typography>
        </Box>
    );
}

export default function CodeChallengeCard({ challenge, isPassed, onPassed }) {
    const [code, setCode] = useState(challenge.code_template || '');
    const [failResult, setFailResult] = useState(null);
    const [showRunResults, setShowRunResults] = useState(false);
    const [hintUsed, setHintUsed] = useState(challenge.user_hint_used || false);
    const [solutionRevealed, setSolutionRevealed] = useState(challenge.user_solution_revealed || false);
    const { submitAnswer, loading: submitLoading } = useSubmitChallenge();
    const { runCode, loading: runLoading, runResult, clearRunResult } = useRunCode();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const user = useAuthStore((s) => s.user);
    const emailVerified = user?.email_verified === true;
    const navigate = useNavigate();

    if (isPassed) {
        return (
            <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ py: 0.5, borderRadius: 1.5 }}>
                Completed — great job!
            </Alert>
        );
    }

    if (isLoggedIn && !emailVerified) {
        return (
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                gap: 1.5, px: 1.5, py: 1.25, borderRadius: 1.5,
                border: '1px solid rgba(255,183,77,0.3)',
                background: 'rgba(255,183,77,0.06)',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedOutlinedIcon sx={{ fontSize: '1rem', color: '#FFD080', flexShrink: 0 }} />
                    <Box component="span" sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)' }}>
                        Verify your email to run or submit code.
                    </Box>
                </Box>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate('/my-profile')}
                    sx={{
                        flexShrink: 0, fontSize: '0.75rem',
                        borderColor: 'rgba(255,183,77,0.4)', color: '#FFD080',
                        '&:hover': { borderColor: '#FFD080', background: 'rgba(255,183,77,0.08)' },
                    }}
                >
                    Verify now
                </Button>
            </Box>
        );
    }

    const language = challenge.code_language || 'python';
    const monacoLang = MONACO_LANG[language] || 'plaintext';
    const isLoading = submitLoading || runLoading;

    const handleRun = async () => {
        clearRunResult();
        setFailResult(null);
        await runCode({ slug_challenge: challenge.slug, payload: { code, language } });
        setShowRunResults(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        clearRunResult();
        setShowRunResults(false);
        setFailResult(null);
        const res = await submitAnswer({
            slug_challenge: challenge.slug,
            payload: { code, language, hint_used: hintUsed },
        });
        if (res?.status === 'accepted') {
            onPassed(challenge.id);
        } else if (res) {
            setFailResult(res);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Editor header bar */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                px: 1.5, py: 0.75,
                background: '#1e1e2e',
                borderRadius: '8px 8px 0 0',
                border: '1px solid rgba(255,255,255,0.07)',
                borderBottom: 'none',
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Traffic-light dots */}
                    {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                        <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
                    ))}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                        <TerminalIcon sx={{ fontSize: '0.8rem', opacity: 0.4 }} />
                        <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 600, letterSpacing: '0.06em', fontSize: '0.7rem' }}>
                            EDITOR
                        </Typography>
                    </Box>
                </Box>
                <Chip
                    label={language}
                    size="small"
                    sx={{
                        height: 18, fontSize: '0.65rem', fontWeight: 700,
                        background: 'rgba(108,142,255,0.15)',
                        color: 'primary.light',
                        border: '1px solid rgba(108,142,255,0.25)',
                        textTransform: 'lowercase',
                    }}
                />
            </Box>

            {/* Monaco Editor */}
            <Box sx={{
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                overflow: 'hidden',
            }}>
                <Editor
                    height="280px"
                    language={monacoLang}
                    value={code}
                    onChange={(val) => { setCode(val ?? ''); setFailResult(null); }}
                    theme="vs-dark"
                    options={{
                        fontSize: 13,
                        fontFamily: '"Fira Mono", "Cascadia Code", "Consolas", monospace',
                        fontLigatures: true,
                        lineHeight: 22,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        tabSize: 4,
                        renderLineHighlight: 'line',
                        smoothScrolling: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        padding: { top: 12, bottom: 12 },
                        readOnly: isLoading || solutionRevealed,
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        scrollbar: {
                            vertical: 'auto',
                            horizontal: 'hidden',
                            verticalScrollbarSize: 6,
                        },
                    }}
                />
            </Box>

            {/* Run results */}
            {runResult && (
                <Box sx={{ borderRadius: 1.5, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <Button
                        size="small"
                        variant="text"
                        onClick={() => setShowRunResults((v) => !v)}
                        endIcon={showRunResults ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                        sx={{
                            width: '100%', justifyContent: 'flex-start', px: 1.5, py: 0.75,
                            textTransform: 'none', fontSize: '0.8rem', fontWeight: 600,
                            background: 'rgba(0,0,0,0.2)',
                            color: runResult.passed === runResult.total ? 'success.light' : 'warning.light',
                            borderRadius: 0,
                        }}
                    >
                        Run: {runResult.passed}/{runResult.total} tests passed
                    </Button>
                    <Collapse in={showRunResults}>
                        <Box sx={{ p: 1, background: 'rgba(0,0,0,0.15)' }}>
                            {runResult.results.map((r, i) => (
                                <TestResultRow key={i} r={r} index={i} />
                            ))}
                        </Box>
                    </Collapse>
                </Box>
            )}

            {failResult && (
                <Alert severity="error" sx={{ py: 0.5, borderRadius: 1.5 }}>
                    {failResult.passed}/{failResult.total} tests passed · {failResult.score} pts earned
                </Alert>
            )}

            <HintSolutionBar
                challenge={challenge}
                onHintUsed={() => setHintUsed(true)}
                onSolutionRevealed={() => setSolutionRevealed(true)}
                isLoggedIn={isLoggedIn}
            />

            {!isLoggedIn ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate('/sign-in')}
                        startIcon={<PlayArrowIcon />}
                        sx={{
                            flex: 1, borderRadius: 1.5,
                            borderColor: 'rgba(108,142,255,0.3)', color: 'primary.light',
                            '&:hover': { borderColor: 'primary.main', background: 'rgba(108,142,255,0.08)' },
                        }}
                    >
                        Sign in to run
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate('/sign-in')}
                        startIcon={<SendIcon />}
                        sx={{ flex: 1, borderRadius: 1.5 }}
                    >
                        Sign in to submit
                    </Button>
                </Box>
            ) : !solutionRevealed && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        type="button"
                        variant="outlined"
                        size="small"
                        onClick={handleRun}
                        disabled={!code.trim() || isLoading}
                        startIcon={runLoading ? <CircularProgress size={13} color="inherit" /> : <PlayArrowIcon />}
                        sx={{
                            flex: 1, borderRadius: 1.5,
                            borderColor: 'rgba(108,142,255,0.3)', color: 'primary.light',
                            '&:hover': { borderColor: 'primary.main', background: 'rgba(108,142,255,0.08)' },
                        }}
                    >
                        Run
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        disabled={!code.trim() || isLoading || isPassed}
                        startIcon={submitLoading ? <CircularProgress size={13} color="inherit" /> : <SendIcon />}
                        sx={{ flex: 1, borderRadius: 1.5 }}
                    >
                        Submit
                    </Button>
                </Box>
            )}
        </Box>
    );
}
