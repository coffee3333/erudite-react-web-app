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
import { GoogleIcon } from '../../components/common/CustomIcons.jsx';
import Logo from "../../components/common/Logo.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useSignUp from "../../hooks/authHooks/useSignUp.jsx";
import {FormHelperText} from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import GoogleLoginButton from "../../components/common/GoogleLoginButton.jsx";
import ParticleBackground from '../MainPage/components/ParticleBackground.jsx';


const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        'hsla(270, 40%, 10%, 0.08) 0px 5px 15px 0px, hsla(260, 30%, 15%, 0.06) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(270, 50%, 5%, 0.6) 0px 5px 20px 0px, hsla(260, 40%, 8%, 0.35) 0px 15px 40px -5px, 0 0 0 1px hsla(270, 60%, 50%, 0.08)',
    }),
}));

export default function SignUp() {
    const navigate = useNavigate();
    const { signUp, error } = useSignUp();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordRepeatError, setPasswordRepeatError] = useState(false);
    const [passwordRepeatErrorMessage, setPasswordRepeatErrorMessage] = useState('');
    const [role, setRole] = useState('');
    const [roleError, setRoleError] = useState(false);
    const [roleErrorMessage, setRoleErrorMessage] = useState('');
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Username validation regex (alphanumeric, 3-20 characters)
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    // Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, 1 special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Live validation for username
    useEffect(() => {
        if (username === '') {
            setUsernameError(false);
            setUsernameErrorMessage('');
        } else if (!usernameRegex.test(username)) {
            setUsernameError(true);
            setUsernameErrorMessage('Username must be 3-20 characters and alphanumeric.');
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
        }
    }, [username]);

    // Live validation for email
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

    // Live validation for password
    useEffect(() => {
        if (password === '') {
            setPasswordError(false);
            setPasswordErrorMessage('');
        } else if (!passwordRegex.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*).');
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    }, [password]);

    // Live validation for password repeat
    useEffect(() => {
        if (passwordRepeat === '') {
            setPasswordRepeatError(false);
            setPasswordRepeatErrorMessage('');
        } else if (passwordRepeat !== password) {
            setPasswordRepeatError(true);
            setPasswordRepeatErrorMessage('Passwords do not match.');
        } else {
            setPasswordRepeatError(false);
            setPasswordRepeatErrorMessage('');
        }
    }, [password, passwordRepeat]);

    // Handle server-side errors
    useEffect(() => {
        if (error) {
            setEmailError(true);
            setEmailErrorMessage(error || 'Signup failed');
        }
    }, [error]);

    // Form submission validation
    const validateInputs = () => {
        let isValid = true;

        if (!username) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required.');
            isValid = false;
        } else if (!usernameRegex.test(username)) {
            setUsernameError(true);
            setUsernameErrorMessage('Username must be 3-20 characters and alphanumeric.');
            isValid = false;
        }

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
        } else if (!passwordRegex.test(password)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 8 characters, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*).');
            isValid = false;
        }

        if (!passwordRepeat) {
            setPasswordRepeatError(true);
            setPasswordRepeatErrorMessage('Please repeat your password.');
            isValid = false;
        } else if (passwordRepeat !== password) {
            setPasswordRepeatError(true);
            setPasswordRepeatErrorMessage('Passwords do not match.');
            isValid = false;
        }

        if (!role) {
            setRoleError(true);
            setRoleErrorMessage('Please select a role.');
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
            await signUp({username: username, email: email, password: password, password2: passwordRepeat, role: role});
            setTimeout(() => {
                navigate('/sign-in');
            }, 2650);
        } catch (err) {
            const data = err.response?.data;
            if (data) {
                if (data.password) {
                    setPasswordError(true);
                    setPasswordErrorMessage(data.password);
                    setPasswordRepeat('');
                }
                if (data.username) {
                    setUsernameError(true);
                    setUsernameErrorMessage(data.username);
                }
                if (data.email) {
                    setEmailError(true);
                    setEmailErrorMessage(data.email);
                }
                if (data.role) {
                    setRoleError(true);
                    setRoleErrorMessage(data.role);
                }
            } else {
                console.error('SignUp Error:', err);
            }
        }
    };

    return (
        <>
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
                        Sign up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        <FormControl required error={usernameError}>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Your username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {usernameError && <FormHelperText>{usernameErrorMessage}</FormHelperText>}
                        </FormControl>
                        <FormControl required error={emailError}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Your@email.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <FormHelperText>{emailErrorMessage}</FormHelperText>}
                        </FormControl>
                        <FormControl required error={passwordError}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                name="password"
                                placeholder="••••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {passwordError && <FormHelperText>{passwordErrorMessage}</FormHelperText>}
                        </FormControl>
                        <FormControl required error={passwordRepeatError}>
                            <FormLabel htmlFor="password-repeat">Repeat password</FormLabel>
                            <TextField
                                name="password-repeat"
                                placeholder="••••••••"
                                type="password"
                                id="password-repeat"
                                autoComplete="new-password"
                                value={passwordRepeat}
                                onChange={(e) => setPasswordRepeat(e.target.value)}
                            />
                            {passwordRepeatError && <FormHelperText>{passwordRepeatErrorMessage}</FormHelperText>}
                        </FormControl>

                        <FormControl required error={roleError}>
                            <FormLabel id="role-label" htmlFor="role">Role</FormLabel>
                            <Select
                                id="role"
                                labelId="role-label"
                                name="role"
                                value={role}
                                displayEmpty
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <MenuItem value="">
                                    <em>Select role</em>
                                </MenuItem>
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="teacher">Teacher</MenuItem>
                            </Select>
                            {roleError && <FormHelperText>{roleErrorMessage}</FormHelperText>}
                        </FormControl>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                            Sign up
                        </Button>
                    </Box>
                    <Divider>
                        <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                    </Divider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <GoogleLoginButton label="Sign up with Google" />
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                                component="button"
                                type="button"
                                onClick={() => navigate('/sign-in')}
                            >
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </>
    );
}