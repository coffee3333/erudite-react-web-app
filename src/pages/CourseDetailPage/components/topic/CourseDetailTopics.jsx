import * as React from "react";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, LinearProgress, Chip, Skeleton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import useGetCourseTopics from "../../../../hooks/topicHooks/useGetTopics.jsx";
import CreateTopicButton from "./CreateTopicButton.jsx";
import DeleteTopicButton from "./DeleteTopicButton.jsx";
import UpdateTopicButton from "./UpdateTopicButton.jsx";
import { useNavigate } from "react-router-dom";
import useInView, { prefersReducedMotion } from "../../../../hooks/useInView.jsx";

function TopicRow({ topic, index, owner, onTopicEffected, navigate }) {
    const [ref, inView] = useInView();
    const pct = topic.completion_pct ?? null;
    const count = topic.challenge_count ?? 0;
    const isDone = pct === 100;

    return (
        <Box
            ref={ref}
            key={topic.id || index}
            onClick={() => navigate(`/challenges/${topic.slug}`)}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: isDone ? "rgba(76,175,80,0.3)" : "rgba(108,142,255,0.12)",
                background: isDone
                    ? "linear-gradient(135deg, rgba(76,175,80,0.06) 0%, rgba(13,15,26,0) 60%)"
                    : "rgba(108,142,255,0.03)",
                cursor: "pointer",
                opacity: prefersReducedMotion ? 1 : (inView ? 1 : 0),
                transform: prefersReducedMotion ? 'none' : (inView ? 'translateY(0)' : 'translateY(20px)'),
                transition: prefersReducedMotion
                    ? 'border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s'
                    : `opacity 0.5s ease ${index * 70}ms, transform 0.5s ease ${index * 70}ms, border-color 0.2s, background 0.2s, box-shadow 0.2s`,
                "&:hover": {
                    borderColor: isDone ? "rgba(76,175,80,0.5)" : "rgba(108,142,255,0.35)",
                    background: isDone ? "rgba(76,175,80,0.08)" : "rgba(108,142,255,0.07)",
                    boxShadow: "0 4px 20px rgba(108,142,255,0.1)",
                    transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
            }}
        >
            <Box sx={{
                minWidth: 40, height: 40, borderRadius: 1.5, flexShrink: 0,
                background: isDone ? "rgba(76,175,80,0.15)" : "rgba(108,142,255,0.1)",
                border: `1px solid ${isDone ? "rgba(76,175,80,0.3)" : "rgba(108,142,255,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                {isDone ? (
                    <CheckCircleIcon sx={{ fontSize: "1.1rem", color: "success.light" }} />
                ) : (
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: "primary.light" }}>
                        {String(index + 1).padStart(2, "0")}
                    </Typography>
                )}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: pct !== null ? 0.75 : 0 }}>
                    <Typography sx={{
                        fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3,
                        color: isDone ? "success.light" : "text.primary",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                        {topic.title || "Untitled Topic"}
                    </Typography>
                    {count > 0 && (
                        <Chip
                            label={`${count} challenge${count !== 1 ? "s" : ""}`}
                            size="small"
                            sx={{
                                height: 18, fontSize: "0.65rem", fontWeight: 600, flexShrink: 0,
                                background: "rgba(255,255,255,0.05)",
                                color: "rgba(255,255,255,0.45)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        />
                    )}
                </Box>

                {pct !== null && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                                flex: 1, height: 4,
                                "& .MuiLinearProgress-bar": {
                                    background: isDone
                                        ? "linear-gradient(90deg, #4CAF50, #81C784)"
                                        : "linear-gradient(90deg, #6C8EFF, #B06EFF)",
                                },
                            }}
                        />
                        <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, opacity: 0.7, flexShrink: 0 }}>
                            {pct}%
                        </Typography>
                    </Box>
                )}
            </Box>

            <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
            >
                <UpdateTopicButton slug={topic.slug} owner={owner} initialTitle={topic.title} onUpdated={onTopicEffected} />
                <DeleteTopicButton slug_topic={topic.slug} owner={owner} onDeleted={onTopicEffected} />
            </Box>

            <ChevronRightIcon sx={{ fontSize: "1.1rem", opacity: 0.3, flexShrink: 0 }} />
        </Box>
    );
}

export default function CourseDetailTopics({ slug, owner }) {    const { topics, loading, error, getTopics } = useGetCourseTopics();
    const [refreshFlag, setRefreshFlag] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) getTopics(slug);
    }, [slug, getTopics, refreshFlag]);

    const handleTopicEffected = () => setRefreshFlag((prev) => !prev);

    if (loading) {
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={72} sx={{ borderRadius: 2 }} animation="wave" />
                ))}
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ textAlign: "center", py: 3 }}>
                Error loading topics.
            </Typography>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, opacity: 0.9 }}>
                    Course Topics
                </Typography>
                <CreateTopicButton slug={slug} owner={owner} onCreated={handleTopicEffected} />
            </Box>

            {topics.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 5, opacity: 0.45 }}>
                    <MenuBookIcon sx={{ fontSize: "2rem", mb: 1 }} />
                    <Typography sx={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                        No topics available for this course yet.
                    </Typography>
                </Box>
            ) : (
                topics.map((topic, index) => (
                    <TopicRow
                        key={topic.id || index}
                        topic={topic}
                        index={index}
                        owner={owner}
                        onTopicEffected={handleTopicEffected}
                        navigate={navigate}
                    />
                ))
            )}
        </Box>
    );
}
