// ForgotPassword.jsx
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo.jsx';
import useForgotPassword from '../../hooks/authHooks/useForgotPassword.jsx';
import ParticleBackground from '../MainPage/components/ParticleBackground.jsx';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(270, 40%, 10%, 0.08) 0px 5px 15px 0px, hsla(260, 30%, 15%, 0.06) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(270, 50%, 5%, 0.6) 0px 5px 20px 0px, hsla(260, 40%, 8%, 0.35) 0px 15px 40px -5px, 0 0 0 1px hsla(270, 60%, 50%, 0.08)',
    }),
}));

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { requesting, confirming, codeSent, requestReset, confirmReset } = useForgotPassword();

    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [done, setDone] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        if (!emailRegex.test(email)) return;
        await requestReset(email);
    };

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();
        if (newPassword.length < 8 || newPassword !== confirmPassword) return;
        const ok = await confirmReset({ email, otp_code: otp.trim(), new_password: newPassword });
        if (ok) setDone(true);
    };

    if (done) {
        return (
            <>
                <CssBaseline enableColorScheme />
                <ParticleBackground />
                <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', zIndex: 1 }}>
                    <Card variant="outlined">
                        <Logo />
                        <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
                            Password updated!
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your password has been changed. You can now sign in with your new password.
                        </Typography>
                        <Button variant="contained" fullWidth onClick={() => navigate('/sign-in')}>
                            Go to sign in
                        </Button>
                    </Card>
                </Box>
            </>
        );
    }

    return (
        <>
            <CssBaseline enableColorScheme />
            <ParticleBackground />
            <Box sx={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4, position: 'relative', zIndex: 1 }}>
                <Card variant="outlined">
                    <Logo />
                    <Typography component="h1" variant="h5" sx={{ fontWeight: 700 }}>
                        {codeSent ? 'Enter your code' : 'Forgot password'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {codeSent
                            ? `We sent a 6-digit code to ${email}. Enter it below along with your new password.`
                            : "Enter your account email and we'll send you a reset code."}
                    </Typography>

                    {!codeSent ? (
                        <Box component="form" onSubmit={handleRequestSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    autoComplete="email"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                loading={requesting}
                                disabled={!emailRegex.test(email)}
                            >
                                Send reset code
                            </Button>
                        </Box>
                    ) : (
                        <Box component="form" onSubmit={handleConfirmSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <FormControl>
                                <FormLabel htmlFor="otp">6-digit code</FormLabel>
                                <TextField
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }}
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="new-password">New password</FormLabel>
                                <TextField
                                    id="new-password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    error={newPassword.length > 0 && newPassword.length < 8}
                                    helperText={newPassword.length > 0 && newPassword.length < 8 ? 'At least 8 characters' : ''}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="confirm-password">Confirm new password</FormLabel>
                                <TextField
                                    id="confirm-password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    required
                                    fullWidth
                                    variant="outlined"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={confirmPassword.length > 0 && confirmPassword !== newPassword}
                                    helperText={confirmPassword.length > 0 && confirmPassword !== newPassword ? 'Passwords do not match' : ''}
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                loading={confirming}
                                disabled={otp.length !== 6 || newPassword.length < 8 || newPassword !== confirmPassword}
                            >
                                Reset password
                            </Button>
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                                onClick={() => requestReset(email)}
                            >
                                Resend code
                            </Link>
                        </Box>
                    )}

                    <Link
                        component="button"
                        type="button"
                        variant="body2"
                        sx={{ alignSelf: 'center' }}
                        onClick={() => navigate('/sign-in')}
                    >
                        Back to sign in
                    </Link>
                </Card>
            </Box>
        </>
    );
}
