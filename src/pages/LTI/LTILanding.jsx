import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import useAuthStore from "../../stores/authStore";
import userService from "../../api/endpoints/userService";

/**
 * LTI Landing page — /lti-landing
 *
 * Moodle redirects here after a successful LTI launch with:
 *   ?access=<JWT>&refresh=<JWT>&session=<uuid>&next=<path>
 *
 * We store the tokens, refresh the auth state, then navigate to `next`.
 */
export default function LTILanding() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setAccessToken, setRefreshToken, setUser, setIsLoggedIn } = useAuthStore();

    useEffect(() => {
        const access = searchParams.get("access");
        const refresh = searchParams.get("refresh");
        const next = searchParams.get("next") || "/courses";

        if (!access || !refresh) {
            navigate("/sign-in");
            return;
        }

        // Store tokens in store + localStorage
        setAccessToken(access);
        setRefreshToken(refresh);
        setIsLoggedIn(true);

        // Fetch profile so the auth store has the user object
        // Note: apiClient unwraps response.data, so res IS the profile object
        userService.getProfile()
            .then((res) => {
                setUser(res);
            })
            .finally(() => {
                navigate(next, { replace: true });
            });
    }, []);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary">
                Signing you in via Moodle…
            </Typography>
        </Box>
    );
}
