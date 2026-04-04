import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from '../../components/common/CustomIcons.jsx';
import Logo from "../../components/common/Logo.jsx";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useSignIn from "../../hooks/authHooks/useSignIn.jsx";
import GoogleLoginButton from "../../components/common/GoogleLoginButton.jsx";
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

export default function SignIn() {
    const navigate = useNavigate();
    const { signIn, error, isLoading } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [serverError, setServerError] = useState(false);

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        if (email === '') {
            setEmailError(false);
            setEmailErrorMessage('');
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
    }, [email]);

    useEffect(() => {
        if (password === '') {
            setPasswordError(false);
            setPasswordErrorMessage('');
        } else if (password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters.');
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    }, [password]);

    useEffect(() => {
        if (error) {
            setServerError(true);
            setEmailError(true);
            setPasswordError(true);
            setEmailErrorMessage('Invalid email address.');
            setPasswordErrorMessage('Invalid password.');
        }
    }, [error]);

    useEffect(() => {
        if (serverError && (email !== '' || password !== '')) {
            setServerError(false);
            setEmailError(false);
            setPasswordError(false);

        }
    }, [email, password]);


    // Form submission validation
    const validateInputs = () => {
        let isValid = true;

        if (!email) {
            setEmailError(true);
            setEmailErrorMessage('Email is required.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        }
        if (!password) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required.');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) {
            return;
        }

        try {
            await signIn({ email, password });
            navigate('/');
        } catch {
            // errors shown via toast from apiClient interceptor
        }
    };

    return (
        <>
            <Helmet>
                <title>Sign In — Erudite</title>
                <meta name="description" content="Sign in to your Erudite account to access your courses and challenges." />
            </Helmet>
            <CssBaseline enableColorScheme />
            <ParticleBackground />
            <Box
                sx={{
                    minHeight: '100dvh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    px: 2,
                    py: 4,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <Card variant="outlined">
                    <Logo />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign in
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        {/*<ForgotPassword open={open} handleClose={handleClose} />*/}
                        {/*navigate to forgot password page*/}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            loading={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <Link
                            component="button"
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            variant="body2"
                            sx={{ alignSelf: 'center' }}
                            aria-label="Forgot your password? Go to password reset page"
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <GoogleLoginButton label="Sign in with Google" />
                        <Typography sx={{ textAlign: 'center' }}>
                            Don&apos;t have an account?{' '}
                            <Link
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                                component="button"
                                type="button"
                                onClick={() => {navigate('/sign-up')}}
                            >
                                Sign up
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </>
    );
}