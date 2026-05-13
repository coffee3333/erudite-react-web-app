import { Helmet } from 'react-helmet-async';
import MainWrapper from "../../components/layout/MainWrapper.jsx";
import Hero from "./components/Hero.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import ParticleBackground from "./components/ParticleBackground.jsx";
import useAuthStore from "../../stores/authStore.jsx";

export default function MainPage(){
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

    return (
        <>
            <Helmet>
                <title>Erudite — Interactive Learning Platform</title>
                <meta name="description" content="Ace your exams and master new skills with Erudite. Engage with interactive coding challenges, quizzes, and lessons." />
            </Helmet>
            <ParticleBackground />
            <MainWrapper>
                <Hero/>
                {isLoggedIn ? <Leaderboard /> : <Testimonials/>}
            </MainWrapper>
        </>
    );
}