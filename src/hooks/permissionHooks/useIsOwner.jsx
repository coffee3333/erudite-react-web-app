import useAuthStore from "../../stores/authStore.jsx";

export default function useIsOwner({ owner }) {
    const user = useAuthStore((state) => state.user);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    if (!isLoggedIn) return false;
    if (!user) return false;
    if (user.role !== "teacher") return false;
    if (user.email_verified	 !== true) return false;
    if (owner !== user.username) return false;

    return true;
}