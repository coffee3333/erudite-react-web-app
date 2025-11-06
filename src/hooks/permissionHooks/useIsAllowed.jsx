import useAuthStore from "../../stores/authStore.jsx";

export default function useIsAllowed() {
    const user = useAuthStore((state) => state.user);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    console.log('user', user);

    if (!isLoggedIn) return false;
    if (!user) return false;
    if (user.role !== "teacher") return false;
    if (user.email_verified	 !== true) return false;

    return true;
}