import useAuthStore from "../../stores/authStore.jsx";
import Header from "../common/Header.jsx";
import HeaderUser from "../common/HeaderUser.jsx";
import { useEffect } from "react";


export default function AppBar() {
    const { user, isLoggedIn } = useAuthStore();
    const inconsistentState = (user && !isLoggedIn) || (!user && isLoggedIn);

    useEffect(() => {
        if (inconsistentState) {
            useAuthStore.getState().logout();
        }
    }, [inconsistentState]);

    if (user && isLoggedIn) {
        return <HeaderUser />;
    }
    return <Header />;
}