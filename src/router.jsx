import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CoursesPage from "./pages/CoursesPage/CoursesPage.jsx";
import CourseDetailPage from "./pages/CourseDetailPage/CourseDetailPage.jsx";
import ChallengesPage from "./pages/ChallengesPage/ChallengesPage.jsx";
import CreateCoursePage from "./pages/CoursesPage/CreateCoursePage.jsx";
import UpdateCoursePage from "./pages/CoursesPage/UpdateCoursePage.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainPage />,
    },
    {
        path: '/sign-in',
        element: <SignIn />,
    },
    {
        path: '/sign-up',
        element: <SignUp />,
    },
    {
        path: '/courses',
        element: <CoursesPage />,
    },
    {
        path: '/course/:slug',
        element: <CourseDetailPage />,
    },
    {
        path: '/challenges/:slug',
        element: <ChallengesPage />,
    },
    {
        path: '/create-course',
        element: <CreateCoursePage />,
    },
    {
        path: '/course-edit/:slug',
        element: <UpdateCoursePage />,
    },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;