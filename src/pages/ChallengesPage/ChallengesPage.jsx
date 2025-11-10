import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import useGetChallenges from "../../hooks/challengeHooks/useGetChallenges.jsx";
import MainWrapper from "../../components/layout/MainWrapper.jsx";
import ChallengeCard from "./ChallengeCard.jsx";

export default function ChallengesPage() {
    const { slug } = useParams();
    const { challenges, loading, error, getChallengesViaTopic } =
        useGetChallenges();
    const [refreshFlag, setRefreshFlag] = useState(false);

    useEffect(() => {
        if (slug) getChallengesViaTopic({ slug_topic: slug });
    }, [slug, getChallengesViaTopic, refreshFlag]);

    const handleChallengeUpdated = () => {
        setRefreshFlag((prev) => !prev);
    };

    if (loading)
        return (
            <MainWrapper>
                <Box sx={{ textAlign: "center", py: 6 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, opacity: 0.7 }}>Loading challenges...</Typography>
                </Box>
            </MainWrapper>
        );

    if (error)
        return (
            <MainWrapper>
                <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
                    Error loading challenges.
                </Typography>
            </MainWrapper>
        );

    return (
        <MainWrapper>
            <Box
                sx={{
                    width: "100%",
                    maxWidth: 800,
                    mx: "auto",
                    my: 4,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Challenges for topic: <span style={{ opacity: 0.7 }}>{slug}</span>
                </Typography>

                {challenges.length === 0 ? (
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "rgba(255,255,255,0.6)",
                            fontStyle: "italic",
                            py: 2,
                        }}
                    >
                        No challenges available for this topic.
                    </Typography>
                ) : (
                    challenges.map((challenge, index) => (
                        <ChallengeCard key={challenge.id} index={index} challenge={challenge} />
                    ))
                )}
            </Box>
        </MainWrapper>
    );
}
