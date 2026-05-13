import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const SignIn          = lazy(() => import('./pages/Auth/SignIn.jsx'));
const SignUp          = lazy(() => import('./pages/Auth/SignUp.jsx'));
const ForgotPassword  = lazy(() => import('./pages/Auth/ForgotPassword.jsx'));
const MainPage        = lazy(() => import('./pages/MainPage/MainPage.jsx'));
const CoursesPage     = lazy(() => import('./pages/CoursesPage/CoursesPage.jsx'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage/CourseDetailPage.jsx'));
const TopicPage       = lazy(() => import('./pages/TopicPage/TopicPage.jsx'));
const AboutProject    = lazy(() => import('./components/layout/About.jsx'));
const FAQ             = lazy(() => import('./components/layout/FAQ.jsx'));
const TermsOfService  = lazy(() => import('./components/layout/TermsOfService.jsx'));
const PrivacyPolicy   = lazy(() => import('./components/layout/PrivacyPolicy.jsx'));
const MyProfilePage   = lazy(() => import('./pages/ProfilePage/MyProfilePage.jsx'));
const LTILanding      = lazy(() => import('./pages/LTI/LTILanding.jsx'));

function PageLoader() {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
        </Box>
    );
}

function withSuspense(element) {
    return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

const router = createBrowserRouter([
    { path: '/',                 element: withSuspense(<MainPage />) },
    { path: '/sign-in',          element: withSuspense(<SignIn />) },
    { path: '/sign-up',          element: withSuspense(<SignUp />) },
    { path: '/forgot-password',  element: withSuspense(<ForgotPassword />) },
    { path: '/courses',          element: withSuspense(<CoursesPage />) },
    { path: '/course/:slug',     element: withSuspense(<CourseDetailPage />) },
    // Both /topic/:slug and /challenges/:slug go to the same unified TopicPage
    { path: '/topic/:slug',      element: withSuspense(<TopicPage />) },
    { path: '/challenges/:slug', element: withSuspense(<TopicPage />) },
    { path: '/about-project',    element: withSuspense(<AboutProject />) },
    { path: '/faq',              element: withSuspense(<FAQ />) },
    { path: '/terms-of-use',     element: withSuspense(<TermsOfService />) },
    { path: '/privacy-policy',   element: withSuspense(<PrivacyPolicy />) },
    { path: '/my-profile',       element: withSuspense(<MyProfilePage />) },
    { path: '/lti-landing',      element: withSuspense(<LTILanding />) },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
