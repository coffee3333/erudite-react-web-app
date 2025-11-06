import { useCallback } from "react";
import toast from "react-hot-toast";
import authService from "../../api/endpoints/authService.jsx";
import useAuthStore from "../../stores/authStore.jsx";

const useSignUp = () => {
    const { error, isLoading } = useAuthStore();

    const signUp = useCallback(async ({ email, username, password, password2, role }) => {
        if (!email || !username || !password || !password2 || !role) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (password !== password2) {
            toast.error("Passwords do not match.");
            return;
        }



        const registrationForm = new FormData();
        registrationForm.append("email", email);
        registrationForm.append("username", username);
        registrationForm.append("password", password);
        registrationForm.append("password2", password2);
        registrationForm.append("role", role);

        try {
            await authService.registration({registrationForm});
            toast.success("Successfully signed up!");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Signup failed.");
        }
    }, []);

    return { signUp, error, isLoading};
};

export default useSignUp;
