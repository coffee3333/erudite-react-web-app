/**
 * RichContent.jsx
 *
 * Renders rich content that may contain:
 *  - Block LaTeX:  $$...$$  or  \[...\]
 *  - Inline LaTeX: $...$    or  \(...\)
 *  - An attached image (photo URL)
 *  - Plain text / markdown (via a simple inline renderer)
 *
 * Uses KaTeX for math rendering (no server needed).
 */
import * as React from 'react';
import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Box, Typography } from '@mui/material';

// ── KaTeX render helpers ──────────────────────────────────────────────────────
function renderKatex(expr, displayMode) {
    try {
        return katex.renderToString(expr, {
            displayMode,
            throwOnError: false,
            trust: false,
            strict: false,
        });
    } catch {
        return `<span style="color:#EF9A9A">[LaTeX error]</span>`;
    }
}

// ── Parse text into segments of { type, value } ──────────────────────────────
// Handles:  $$block$$  \[block\]  $inline$  \(inline\)
function parseSegments(text = '') {
    const segments = [];
    // Combined regex: $$...$$  |  \[...\]  |  $...$  |  \(...\)
    const RE = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)/g;
    let last = 0;
    let match;
    while ((match = RE.exec(text)) !== null) {
        if (match.index > last) {
            segments.push({ type: 'text', value: text.slice(last, match.index) });
        }
        const blockExpr = match[1] ?? match[2];
        const inlineExpr = match[3] ?? match[4];
        if (blockExpr !== undefined) {
            segments.push({ type: 'block-math', value: blockExpr.trim() });
        } else {
            segments.push({ type: 'inline-math', value: inlineExpr.trim() });
        }
        last = match.index + match[0].length;
    }
    if (last < text.length) {
        segments.push({ type: 'text', value: text.slice(last) });
    }
    return segments;
}

// ── Inline markdown on plain-text segments ────────────────────────────────────
function inlineMd(text = '') {
    return text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        // fenced code (single-line fallback for inline)
        .replace(/`([^`]+)`/g, '<code class="math-inline-code">$1</code>')
        // bold / italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RichContent({ text, photo, photoAlt, sx }) {
    const segments = useMemo(() => parseSegments(text || ''), [text]);

    // Build one HTML string so we don't break inline flow
    const html = useMemo(() => {
        return segments.map(seg => {
            if (seg.type === 'block-math') {
                return `<div class="math-block">${renderKatex(seg.value, true)}</div>`;
            }
            if (seg.type === 'inline-math') {
                return renderKatex(seg.value, false);
            }
            // plain text — apply lightweight inline markdown
            return inlineMd(seg.value);
        }).join('');
    }, [segments]);

    if (!text && !photo) return null;

    return (
        <Box sx={sx}>
            {photo && (
                <Box sx={{
                    mb: text ? 1.5 : 0,
                    borderRadius: 1.5, overflow: 'hidden',
                    border: '1px solid rgba(108,142,255,0.15)',
                    maxWidth: '100%',
                    '& img': { width: '100%', maxHeight: 300, height: 'auto', display: 'block', objectFit: 'contain' },
                }}>
                    <img src={photo} alt={photoAlt || 'image'} loading="lazy" />
                </Box>
            )}
            {text && (
                <Box
                    dangerouslySetInnerHTML={{ __html: html }}
                    sx={{
                        lineHeight: 1.75,
                        opacity: 0.85,
                        whiteSpace: 'pre-wrap',
                        // KaTeX display block
                        '& .math-block': {
                            my: 1.5,
                            overflowX: 'auto',
                            textAlign: 'center',
                            '& .katex-display': { margin: 0 },
                        },
                        // KaTeX inline
                        '& .katex': { fontSize: '1em' },
                        // inline code
                        '& .math-inline-code': {
                            fontFamily: '"Fira Mono", "Consolas", monospace',
                            fontSize: '0.82em',
                            background: 'rgba(108,142,255,0.12)',
                            border: '1px solid rgba(108,142,255,0.2)',
                            borderRadius: '4px',
                            px: '5px', py: '1px',
                            color: '#92AAFF',
                        },
                    }}
                />
            )}
        </Box>
    );
}
