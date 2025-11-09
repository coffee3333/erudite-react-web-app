import * as React from "react";
import {useEffect, useState} from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import useGetCourseTopics from "../../../../hooks/topicHooks/useGetTopics.jsx";
import CreateTopicButton from "./CreateTopicButton.jsx";
import DeleteTopicButton from "./DeleteTopicButton.jsx";
import {useNavigate} from "react-router-dom";
import UpdateTopicButton from "./UpdateTopicButton.jsx";

export default function CourseDetailTopics({ slug, owner }) {
    const { topics, loading, error, getTopics } = useGetCourseTopics();
    const [refreshFlag, setRefreshFlag] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) getTopics(slug);
    }, [slug, getTopics, refreshFlag]); // 🔹 зависимость

    const handleTopicEffected = () => {
        setRefreshFlag((prev) => !prev); // 🔹 переключаем флаг → useEffect сработает
    };

    if (loading)
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress size={28} />
                <Typography sx={{ mt: 1, opacity: 0.7 }}>Loading topics...</Typography>
            </Box>
        );

    if (error)
        return (
            <Typography color="error" sx={{ textAlign: "center", py: 3 }}>
                Error loading topics.
            </Typography>
        );

    return (
        <Box
            sx={{
                width: "100%",
                mx: "auto",
                my: 4,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <CreateTopicButton slug={slug} owner={owner} onCreated={handleTopicEffected}  />
            {topics.length === 0 ? (
                <Typography
                    sx={{
                        textAlign: "center",
                        color: "rgba(255,255,255,0.6)",
                        fontStyle: "italic",
                        py: 2,
                    }}
                >
                    No topics available for this course.
                </Typography>
            ) : (
                topics.map((topic, index) => (
                    <Box
                        key={topic.id || index}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid rgba(255,255,255,0.15)",
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: "rgba(255,255,255,0.03)",
                        }}
                    >
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            cursor: "pointer",

                        }} onClick={() => navigate(`/challenges/${topic.slug}`)}
                        >

                            <Box
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: "1.1rem",
                                }}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </Box>

                            <Typography sx={{ fontWeight: 500, fontSize: "1rem" }}>
                                {topic.title || "Untitled Topic"}
                            </Typography>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexDirection: "row",
                            gap: 1,
                        }}>
                            <UpdateTopicButton slug={topic.slug} owner={owner} initialTitle={topic.title} onUpdated={handleTopicEffected} />
                            <DeleteTopicButton slug_topic={topic.slug} owner={owner} onDeleted={handleTopicEffected} />
                        </Box>
                    </Box>
                ))
            )}
        </Box>
    );
}
