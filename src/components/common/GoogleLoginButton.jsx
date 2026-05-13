import { useGoogleLogin } from '@react-oauth/google';
import Button from '@mui/material/Button';
import { GoogleIcon } from './CustomIcons.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import authService from '../../api/endpoints/authService.jsx';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginButton({ label = 'Continue with Google' }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSuccess = async (tokenResponse) => {
        setLoading(true);
        try {
            await authService.loginWithGoogle(tokenResponse.access_token);
            toast.success('Signed in with Google!');
            navigate('/');
        } catch {
            // apiClient interceptor handles the error toast
        } finally {
            setLoading(false);
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: () => toast.error('Google sign-in was cancelled or failed.'),
    });

    return (
        <Button
            fullWidth
            variant="outlined"
            onClick={() => login()}
            disabled={loading}
            startIcon={<GoogleIcon />}
        >
            {loading ? 'Signing in…' : label}
        </Button>
    );
}
