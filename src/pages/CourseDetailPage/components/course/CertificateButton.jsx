// CertificateButton.jsx
// Shows a download certificate button when the current user has earned a certificate for the course.
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button, Tooltip, Typography, CircularProgress, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DownloadIcon from '@mui/icons-material/Download';
import useGetCertificate from '../../../../hooks/courseHooks/useGetCertificate.jsx';
import useAuthStore from '../../../../stores/authStore.jsx';

export default function CertificateButton({ slug, courseTitle }) {
    const { isLoggedIn } = useAuthStore();
    const { certificate, loading, getCertificate, downloadCertificate } = useGetCertificate();
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (isLoggedIn && slug) {
            getCertificate({ slug });
        }
    }, [isLoggedIn, slug, getCertificate]);

    if (!isLoggedIn || loading || !certificate) return null;

    const handleDownload = async () => {
        setDownloading(true);
        await downloadCertificate({ slug, courseTitle });
        setDownloading(false);
    };

    const scorePct = certificate.score_pct != null ? Math.round(certificate.score_pct) : null;

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            px: 2, py: 1.25, borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(200,151,42,0.12) 0%, rgba(200,151,42,0.06) 100%)',
            border: '1px solid rgba(200,151,42,0.3)',
        }}>
            <EmojiEventsIcon sx={{ color: '#C8972A', fontSize: '1.3rem', flexShrink: 0 }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#C8972A', lineHeight: 1.2 }}>
                    Certificate earned!
                </Typography>
                {scorePct != null && (
                    <Typography sx={{ fontSize: '0.72rem', opacity: 0.7, mt: 0.2 }}>
                        Score: {scorePct}%
                    </Typography>
                )}
            </Box>

            {scorePct != null && (
                <Chip
                    label={`${scorePct}%`}
                    size="small"
                    sx={{
                        height: 20, fontSize: '0.68rem', fontWeight: 700,
                        background: 'rgba(200,151,42,0.2)', color: '#C8972A',
                        border: '1px solid rgba(200,151,42,0.35)',
                    }}
                />
            )}

            <Tooltip title="Download your certificate as PDF">
                <Button
                    size="small"
                    variant="contained"
                    onClick={handleDownload}
                    disabled={downloading}
                    startIcon={downloading
                        ? <CircularProgress size={13} color="inherit" />
                        : <DownloadIcon sx={{ fontSize: '1rem' }} />
                    }
                    sx={{
                        background: 'linear-gradient(135deg, #C8972A, #e0b040)',
                        color: '#1A1A2E',
                        fontWeight: 700, fontSize: '0.78rem',
                        px: 1.5, py: 0.6, borderRadius: 1.5,
                        flexShrink: 0,
                        '&:hover': { background: 'linear-gradient(135deg, #e0b040, #C8972A)' },
                        '&:disabled': { opacity: 0.6 },
                    }}
                >
                    {downloading ? 'Downloading…' : 'Download PDF'}
                </Button>
            </Tooltip>
        </Box>
    );
}
