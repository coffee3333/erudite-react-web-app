import useAuthStore from "../../stores/authStore.jsx";
import Header from "../common/Header.jsx";
import HeaderUser from "../common/HeaderUser.jsx";


export default function AppBar() {
    const { user,  isLoggedIn} = useAuthStore();

    if (!user && !isLoggedIn) {
        return <Header />
    }
    if (user && !isLoggedIn || !user && isLoggedIn) {
        useAuthStore.getState().logout();
        return <Header />;
    }
    if (user && isLoggedIn) {
        return <HeaderUser />;
    }
}