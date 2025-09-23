import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from "./pages/landing-page/LandingPage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;