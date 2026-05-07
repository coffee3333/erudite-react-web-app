// CreateCodeChallengeButton.jsx — modal to create code challenges
import * as React from 'react';
import { useState } from 'react';
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Box, Typography, IconButton, CircularProgress,
    Divider, Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Editor from '@monaco-editor/react';
import useIsOwner from '../../../hooks/permissionHooks/useIsOwner.jsx';
import useCreateChallenge from '../../../hooks/challengeHooks/useCreateChallenge.jsx';

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const LANGUAGES = ['python', 'javascript', 'java', 'cpp'];
const MONACO_LANG = { python: 'python', javascript: 'javascript', java: 'java', cpp: 'cpp' };

const STARTER_DEFAULTS = {
    python:     '# Write your solution here\n\nimport sys\n\ndef solve():\n    data = sys.stdin.read().strip()\n    # TODO\n    pass\n\nsolve()\n',
    javascript: '// Write your solution here\n\nconst lines = require("fs").readFileSync("/dev/stdin","utf8").trim().split("\\n");\n\nfunction solve() {\n    // TODO\n}\n\nsolve();\n',
    java:       'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // TODO\n    }\n}\n',
    cpp:        '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // TODO\n    return 0;\n}\n',
};

const EMPTY_TEST = () => ({ stdin: '', expected: '', is_public: true });

const INITIAL_FORM = {
    title: '',
    body: '',
    difficulty: 'easy',
    points: 20,
    language: 'python',
    solution_template: STARTER_DEFAULTS.python,
    hint: '',
    solution_explanation: '',
    test_cases: [EMPTY_TEST()],
};

export default function CreateCodeChallengeButton({ topicId, owner, onCreated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(INITIAL_FORM);
    const { createCodeChallenge, loading } = useCreateChallenge();
    const isOwner = useIsOwner({ owner });

    if (!isOwner) return null;

    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); setForm(INITIAL_FORM); };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'language') {
            setForm((prev) => ({
                ...prev,
                language: value,
                solution_template: STARTER_DEFAULTS[value] ?? prev.solution_template,
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ── Test case helpers ────────────────────────────────────────────────────
    const handleTestChange = (index, field, value) => {
        setForm((prev) => {
            const updated = prev.test_cases.map((tc, i) =>
                i === index ? { ...tc, [field]: value } : tc
            );
            return { ...prev, test_cases: updated };
        });
    };

    const addTestCase = () =>
        setForm((prev) => ({ ...prev, test_cases: [...prev.test_cases, EMPTY_TEST()] }));

    const removeTestCase = (index) =>
        setForm((prev) => ({
            ...prev,
            test_cases: prev.test_cases.filter((_, i) => i !== index),
        }));

    const togglePublic = (index) =>
        setForm((prev) => {
            const updated = prev.test_cases.map((tc, i) =>
                i === index ? { ...tc, is_public: !tc.is_public } : tc
            );
            return { ...prev, test_cases: updated };
        });

    // ── Submit ───────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        const payload = {
            topic: topicId,
            title: form.title,
            body: form.body,
            difficulty: form.difficulty,
            points: Number(form.points),
            challenge_type: 'code',
            code_config: {
                language: form.language,
                solution_template: form.solution_template,
                test_cases: form.test_cases
                    .filter((tc) => tc.stdin.trim() || tc.expected.trim())
                    .map((tc) => ({
                        stdin: tc.stdin,
                        expected_stdout: tc.expected,
                        is_public: tc.is_public,
                    })),
            },
        };
        if (form.hint.trim()) payload.hint = form.hint.trim();
        if (form.solution_explanation.trim()) payload.solution_explanation = form.solution_explanation.trim();

        const res = await createCodeChallenge({ payload });
        if (res) { onCreated?.(); handleClose(); }
    };

    const isValid = form.title.trim() && form.body.trim() && form.language;

    return (
        <>
            <Button variant="outlined" startIcon={<CodeIcon />} onClick={handleOpen} size="small">
                Add Code Challenge
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    New Code Challenge
                    <IconButton size="small" onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>

                    <TextField fullWidth label="Title" name="title" value={form.title}
                        onChange={handleChange} size="small" required />

                    <TextField fullWidth multiline minRows={3} label="Problem Statement" name="body"
                        value={form.body} onChange={handleChange} size="small" required />

                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <TextField select label="Language" name="language" value={form.language}
                            onChange={handleChange} size="small" sx={{ minWidth: 130 }}>
                            {LANGUAGES.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                        </TextField>
                        <TextField select label="Difficulty" name="difficulty" value={form.difficulty}
                            onChange={handleChange} size="small" sx={{ minWidth: 110 }}>
                            {DIFFICULTIES.map((d) => (
                                <MenuItem key={d} value={d} sx={{ textTransform: 'capitalize' }}>{d}</MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Points" name="points" type="number" value={form.points}
                            onChange={handleChange} size="small" inputProps={{ min: 1, max: 1000 }}
                            sx={{ maxWidth: 100 }} />
                    </Box>

                    {/* ── Starter code editor ── */}
                    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                        <Box sx={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            px: 1.5, py: 0.75,
                            background: 'rgba(108,142,255,0.06)',
                            borderBottom: '1px solid', borderColor: 'divider',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CodeIcon sx={{ fontSize: '0.95rem', opacity: 0.6 }} />
                                <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.8 }}>
                                    Starter Code Template
                                </Typography>
                            </Box>
                            <Chip label={form.language} size="small" sx={{
                                height: 20, fontSize: '0.68rem', fontWeight: 700,
                                background: 'rgba(108,142,255,0.15)', color: 'primary.light',
                                border: '1px solid rgba(108,142,255,0.25)',
                            }} />
                        </Box>
                        <Editor
                            height="220px"
                            language={MONACO_LANG[form.language] || 'plaintext'}
                            value={form.solution_template}
                            onChange={(val) => setForm((prev) => ({ ...prev, solution_template: val ?? '' }))}
                            theme="vs-dark"
                            options={{
                                fontSize: 13,
                                fontFamily: '"Fira Mono", "Cascadia Code", monospace',
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                renderLineHighlight: 'line',
                                tabSize: 4,
                                wordWrap: 'on',
                                padding: { top: 10, bottom: 10 },
                                scrollbar: { verticalScrollbarSize: 6 },
                            }}
                        />
                    </Box>

                    <TextField fullWidth multiline minRows={2} label="Hint (optional)" name="hint"
                        value={form.hint} onChange={handleChange} size="small"
                        helperText="Shown to students on demand — costs them 50% of points" />

                    <TextField fullWidth multiline minRows={2} label="Solution explanation (optional)"
                        name="solution_explanation" value={form.solution_explanation}
                        onChange={handleChange} size="small"
                        helperText="Full explanation revealed on demand — blocks student from submitting afterwards" />

                    {/* ── Test cases ── */}
                    <Divider>
                        <Typography variant="caption" sx={{ opacity: 0.6 }}>Test Cases</Typography>
                    </Divider>

                    {form.test_cases.map((tc, index) => (
                        <Box key={index} sx={{
                            border: '1px solid', borderColor: 'divider',
                            borderRadius: 1, overflow: 'hidden',
                        }}>
                            {/* Test case header */}
                            <Box sx={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                px: 1.5, py: 0.6,
                                background: 'rgba(255,255,255,0.03)',
                                borderBottom: '1px solid', borderColor: 'divider',
                            }}>
                                <Typography variant="caption" sx={{ fontWeight: 600, opacity: 0.7 }}>
                                    Test #{index + 1}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {/* Public/hidden toggle */}
                                    <Chip
                                        icon={tc.is_public
                                            ? <VisibilityIcon sx={{ fontSize: '0.75rem !important' }} />
                                            : <VisibilityOffIcon sx={{ fontSize: '0.75rem !important' }} />}
                                        label={tc.is_public ? 'Public' : 'Hidden'}
                                        size="small"
                                        onClick={() => togglePublic(index)}
                                        sx={{
                                            height: 20, fontSize: '0.65rem', fontWeight: 600,
                                            cursor: 'pointer',
                                            background: tc.is_public
                                                ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.12)',
                                            color: tc.is_public ? 'success.light' : 'warning.light',
                                            border: `1px solid ${tc.is_public ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.25)'}`,
                                        }}
                                    />
                                    {form.test_cases.length > 1 && (
                                        <IconButton size="small" onClick={() => removeTestCase(index)}
                                            sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.light' } }}>
                                            <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>

                            {/* stdin / stdout fields */}
                            <Box sx={{ display: 'flex', gap: 0, '& > *': { flex: 1 } }}>
                                <TextField
                                    multiline minRows={2}
                                    label="stdin (input)"
                                    value={tc.stdin}
                                    onChange={(e) => handleTestChange(index, 'stdin', e.target.value)}
                                    size="small"
                                    placeholder={"5\n3"}
                                    inputProps={{ spellCheck: false }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 0, borderRight: 'none' },
                                        '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.82rem' },
                                    }}
                                />
                                <TextField
                                    multiline minRows={2}
                                    label="expected stdout (output)"
                                    value={tc.expected}
                                    onChange={(e) => handleTestChange(index, 'expected', e.target.value)}
                                    size="small"
                                    placeholder={"8"}
                                    inputProps={{ spellCheck: false }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': { borderRadius: 0 },
                                        '& .MuiInputBase-input': { fontFamily: 'monospace', fontSize: '0.82rem' },
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}

                    <Button
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={addTestCase}
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Add Test Case
                    </Button>

                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} size="small">Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" size="small"
                        disabled={!isValid || loading}
                        endIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
