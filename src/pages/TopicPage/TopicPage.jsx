// TopicPage.jsx — unified lesson + challenges page with a tab slider
import * as React from 'react';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Box, Typography, IconButton, Chip, LinearProgress,
    Skeleton, Alert, useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import MainWrapper from '../../components/layout/MainWrapper.jsx';
import useGetTopicDetail from '../../hooks/topicHooks/useGetTopicDetail.jsx';
import useGetChallenges from '../../hooks/challengeHooks/useGetChallenges.jsx';
import useIsOwner from '../../hooks/permissionHooks/useIsOwner.jsx';

import LessonView from './components/LessonView.jsx';
import CreateLessonButton from './components/CreateLessonButton.jsx';
import ChallengeCard from '../ChallengesPage/ChallengeCard.jsx';
import CreateChallengeButton from '../ChallengesPage/components/CreateChallengeButton.jsx';
import CreateCodeChallengeButton from '../ChallengesPage/components/CreateCodeChallengeButton.jsx';

// ── Tab slider pill ───────────────────────────────────────────────────────────
function TabSlider({ activeTab, onChange, lessonCount, challengeCount, passedCount }) {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const neutralBg   = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,21,58,0.04)';
    const neutralBdr  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(18,21,58,0.08)';
    const inactiveClr = isDark ? 'rgba(255,255,255,0.45)' : 'rgba(18,21,58,0.45)';
    const hoverClr    = isDark ? 'rgba(255,255,255,0.75)' : 'rgba(18,21,58,0.75)';
    const chipInactive = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(18,21,58,0.07)';
    const chipInactiveTxt = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(18,21,58,0.4)';

    const tabs = [
        {
            id: 'lessons',
            label: 'Lessons',
            icon: <MenuBookIcon sx={{ fontSize: '0.9rem' }} />,
            count: lessonCount,
            accent: '#B06EFF',
            accentBg: 'rgba(176,110,255,0.12)',
            accentBorder: 'rgba(176,110,255,0.3)',
        },
        {
            id: 'challenges',
            label: 'Challenges',
            icon: <EmojiEventsIcon sx={{ fontSize: '0.9rem' }} />,
            count: challengeCount,
            extra: passedCount > 0 ? `${passedCount}/${challengeCount} done` : null,
            accent: '#6C8EFF',
            accentBg: 'rgba(108,142,255,0.12)',
            accentBorder: 'rgba(108,142,255,0.3)',
        },
    ];

    return (
        <Box
            role="tablist"
            aria-label="Content sections"
            sx={{
            display: 'inline-flex',
            p: 0.5,
            borderRadius: 2.5,
            background: neutralBg,
            border: `1px solid ${neutralBdr}`,
            gap: 0.5,
        }}>
            {tabs.map(tab => {
                const active = activeTab === tab.id;
                return (
                    <Box
                        key={tab.id}
                        role="tab"
                        tabIndex={active ? 0 : -1}
                        aria-selected={active}
                        onClick={() => onChange(tab.id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(tab.id)}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: 0.75,
                            px: 2, py: 0.75, borderRadius: 2,
                            cursor: 'pointer',
                            fontWeight: active ? 700 : 500,
                            fontSize: '0.85rem',
                            color: active ? tab.accent : inactiveClr,
                            background: active ? tab.accentBg : 'transparent',
                            border: `1px solid ${active ? tab.accentBorder : 'transparent'}`,
                            transition: 'all 0.18s ease',
                            userSelect: 'none',
                            '&:hover': !active ? { color: hoverClr, background: neutralBg } : {},
                        }}
                    >
                        {tab.icon}
                        <Typography sx={{ fontWeight: 'inherit', fontSize: 'inherit', color: 'inherit' }}>
                            {tab.label}
                        </Typography>
                        {tab.count != null && (
                            <Chip
                                label={tab.extra || tab.count}
                                size="small"
                                sx={{
                                    height: 18, fontSize: '0.62rem', fontWeight: 700,
                                    background: active ? `${tab.accent}25` : chipInactive,
                                    color: active ? tab.accent : chipInactiveTxt,
                                    border: `1px solid ${active ? `${tab.accent}40` : 'transparent'}`,
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

// ── Lessons panel ─────────────────────────────────────────────────────────────
function LessonsPanel({ lessons, owner, topicSlug, onRefresh }) {
    const [activeIdx, setActiveIdx] = useState(0);
    const isOwner = useIsOwner({ owner });
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    const neutralHover = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,21,58,0.04)';
    const inactiveClr  = isDark ? 'rgba(255,255,255,0.5)'  : 'rgba(18,21,58,0.45)';
    const hoverClr     = isDark ? 'rgba(255,255,255,0.8)'  : 'rgba(18,21,58,0.8)';
    const chipInactive = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(18,21,58,0.06)';

    if (lessons.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.45 }}>
                <MenuBookIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
                <Typography sx={{ fontStyle: 'italic' }}>
                    {isOwner ? 'No lessons yet. Add the first one!' : 'No lessons available for this topic.'}
                </Typography>
            </Box>
        );
    }

    const lesson = lessons[activeIdx];

    return (
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            {/* Sidebar nav — visible on md+ */}
            {lessons.length > 1 && (
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column', gap: 0.5,
                    width: 220, flexShrink: 0,
                    position: 'sticky', top: 16,
                }}>
                    <Typography variant="caption" sx={{ opacity: 0.45, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', px: 1, mb: 0.5 }}>
                        In this topic
                    </Typography>
                    {lessons.map((l, i) => (
                        <Box
                            key={l.slug}
                            component="button"
                            onClick={() => setActiveIdx(i)}
                            aria-current={i === activeIdx ? 'true' : undefined}
                            sx={{
                                px: 1.5, py: 1, borderRadius: 1.5, cursor: 'pointer',
                                fontSize: '0.82rem', fontWeight: i === activeIdx ? 700 : 400,
                                color: i === activeIdx ? 'secondary.light' : inactiveClr,
                                background: i === activeIdx ? 'rgba(176,110,255,0.1)' : 'transparent',
                                border: `1px solid ${i === activeIdx ? 'rgba(176,110,255,0.25)' : 'transparent'}`,
                                transition: 'all 0.15s',
                                '&:hover': i !== activeIdx ? { color: hoverClr, background: neutralHover } : {},
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                width: '100%', textAlign: 'left',
                            }}
                        >
                            {i + 1}. {l.title}
                        </Box>
                    ))}
                </Box>
            )}

            {/* Lesson content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Mobile nav pills */}
                {lessons.length > 1 && (
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                        {lessons.map((l, i) => (
                            <Chip
                                key={l.slug}
                                label={`${i + 1}`}
                                size="small"
                                onClick={() => setActiveIdx(i)}
                                sx={{
                                    cursor: 'pointer',
                                    background: i === activeIdx ? 'rgba(176,110,255,0.2)' : chipInactive,
                                    color: i === activeIdx ? 'secondary.light' : inactiveClr,
                                    border: `1px solid ${i === activeIdx ? 'rgba(176,110,255,0.3)' : 'transparent'}`,
                                    fontWeight: i === activeIdx ? 700 : 400,
                                }}
                            />
                        ))}
                    </Box>
                )}

                <Box sx={{
                    p: 3, borderRadius: 2,
                    border: '1px solid rgba(176,110,255,0.12)',
                    background: 'rgba(176,110,255,0.02)',
                }}>
                    <LessonView
                        key={lesson.slug}
                        lesson={lesson}
                        owner={owner}
                        onUpdated={onRefresh}
                        onDeleted={() => {
                            onRefresh();
                            setActiveIdx(Math.max(0, activeIdx - 1));
                        }}
                    />
                </Box>

                {/* Prev / Next navigation */}
                {lessons.length > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Box
                            component="button"
                            onClick={() => activeIdx > 0 && setActiveIdx(activeIdx - 1)}
                            disabled={activeIdx === 0}
                            aria-label="Previous lesson"
                            sx={{
                                px: 2, py: 1, borderRadius: 1.5, cursor: activeIdx > 0 ? 'pointer' : 'default',
                                opacity: activeIdx > 0 ? 1 : 0.25,
                                border: '1px solid rgba(176,110,255,0.2)',
                                color: 'secondary.light', fontSize: '0.82rem', fontWeight: 600,
                                background: 'none',
                                transition: 'background 0.15s',
                                '&:hover': activeIdx > 0 ? { background: 'rgba(176,110,255,0.08)' } : {},
                            }}
                        >
                            ← Previous
                        </Box>
                        <Box
                            component="button"
                            onClick={() => activeIdx < lessons.length - 1 && setActiveIdx(activeIdx + 1)}
                            disabled={activeIdx === lessons.length - 1}
                            aria-label="Next lesson"
                            sx={{
                                px: 2, py: 1, borderRadius: 1.5, cursor: activeIdx < lessons.length - 1 ? 'pointer' : 'default',
                                opacity: activeIdx < lessons.length - 1 ? 1 : 0.25,
                                border: '1px solid rgba(176,110,255,0.2)',
                                color: 'secondary.light', fontSize: '0.82rem', fontWeight: 600,
                                background: 'none',
                                transition: 'background 0.15s',
                                '&:hover': activeIdx < lessons.length - 1 ? { background: 'rgba(176,110,255,0.08)' } : {},
                            }}
                        >
                            Next →
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

// ── Challenges panel ──────────────────────────────────────────────────────────
function ChallengesPanel({ challenges, localPassed, onPassed, onRefresh, topicSlug, topicId, owner, loading }) {
    const passedCount = challenges.filter(c => localPassed.has(c.id) || c.user_status === 'passed').length;
    const totalCount = challenges.length;
    const progressPct = totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 2 }} animation="wave" />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Progress bar */}
            {totalCount > 0 && (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {passedCount} / {totalCount} completed
                        </Typography>
                        <Chip label={`${progressPct}%`} size="small" sx={{
                            height: 18, fontSize: '0.68rem', fontWeight: 700,
                            background: progressPct === 100 ? 'rgba(76,175,80,0.2)' : 'rgba(108,142,255,0.15)',
                            color: progressPct === 100 ? 'success.light' : 'primary.light',
                            border: `1px solid ${progressPct === 100 ? 'rgba(76,175,80,0.3)' : 'rgba(108,142,255,0.2)'}`,
                        }} />
                        {progressPct === 100 && (
                            <CheckCircleIcon sx={{ fontSize: '0.9rem', color: 'success.light' }} />
                        )}
                    </Box>
                    <LinearProgress variant="determinate" value={progressPct} aria-label={`Topic progress: ${progressPct}%`} sx={{
                        height: 4,
                        '& .MuiLinearProgress-bar': {
                            background: progressPct === 100
                                ? 'linear-gradient(90deg, #4CAF50, #81C784)'
                                : 'linear-gradient(90deg, #6C8EFF, #B06EFF)',
                        },
                    }} />
                </Box>
            )}

            {challenges.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6, opacity: 0.45 }}>
                    <EmojiEventsIcon sx={{ fontSize: '2.5rem', mb: 1 }} />
                    <Typography sx={{ fontStyle: 'italic' }}>No challenges yet.</Typography>
                </Box>
            ) : (
                challenges.map((challenge, index) => (
                    <ChallengeCard
                        key={challenge.id}
                        index={index}
                        challenge={challenge}
                        localPassed={localPassed.has(challenge.id)}
                        onPassed={onPassed}
                        onRefresh={onRefresh}
                    />
                ))
            )}
        </Box>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TopicPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const { topic, loading: topicLoading, getTopicDetail } = useGetTopicDetail();
    const { challenges, loading: challengesLoading, getChallengesViaTopic } = useGetChallenges();

    const defaultTab = location.pathname.startsWith('/challenges/') ? 'challenges' : 'lessons';
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [localPassed, setLocalPassed] = useState(new Set());
    const [refreshFlag, setRefreshFlag] = useState(false);
    const initialLoadDone = useRef(false);
    const tabAutoSet = useRef(false);

    const getTopicRef = useRef(getTopicDetail);
    const getChallengesRef = useRef(getChallengesViaTopic);
    getTopicRef.current = getTopicDetail;
    getChallengesRef.current = getChallengesViaTopic;

    useEffect(() => {
        if (slug) {
            getTopicRef.current({ slug });
            getChallengesRef.current({ slug_topic: slug });
        }
    }, [slug, refreshFlag]);

    useEffect(() => {
        if (!topicLoading && topic) initialLoadDone.current = true;
    }, [topicLoading, topic]);

    // Auto-switch to challenges if there are no lessons (only once after data loads)
    const lessons = useMemo(() => (topic?.items || []).filter(i => i.type === 'lesson'), [topic]);
    useEffect(() => {
        if (!tabAutoSet.current && topic && !topicLoading) {
            tabAutoSet.current = true;
            if (lessons.length === 0) setActiveTab('challenges');
        }
    }, [topic, topicLoading, lessons]);

    const handlePassed = useCallback((id) => setLocalPassed(prev => new Set(prev).add(id)), []);
    const handleRefresh = useCallback(() => {
        setLocalPassed(new Set());
        setRefreshFlag(prev => !prev);
    }, []);

    const owner = topic?.owner || null;
    const topicId = topic?.id || null;

    const passedCount = useMemo(
        () => challenges.filter(c => localPassed.has(c.id) || c.user_status === 'passed').length,
        [challenges, localPassed]
    );

    // Initial skeleton
    if ((topicLoading || challengesLoading) && !initialLoadDone.current) {
        return (
            <MainWrapper>
                <Box sx={{ maxWidth: 1250, mx: 'auto', width: '100%', my: 4, p: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton width={240} height={32} />
                    </Box>
                    <Skeleton width={180} height={44} sx={{ borderRadius: 3, mb: 3 }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} animation="wave" />
                        ))}
                    </Box>
                </Box>
            </MainWrapper>
        );
    }

    if (!topic && !topicLoading) {
        return (
            <MainWrapper>
                <Box sx={{ maxWidth: 1250, mx: 'auto', p: 4 }}>
                    <Alert severity="error">Topic not found.</Alert>
                </Box>
            </MainWrapper>
        );
    }

    return (
        <MainWrapper>
            <Helmet>
                <title>{topic?.title ? `${topic.title} — Erudite` : 'Topic — Erudite'}</title>
                <meta name="description" content={topic?.description || `Explore lessons and challenges for ${topic?.title || 'this topic'} on Erudite.`} />
            </Helmet>
            <Box sx={{ maxWidth: 1250, mx: 'auto', width: '100%', my: 4, px: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* ── Header ── */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <IconButton size="small" onClick={() => navigate(-1)} aria-label="Go back" sx={{ mt: 0.5, opacity: 0.6, '&:hover': { opacity: 1 } }}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.5rem' }, wordBreak: 'break-word' }}>
                                {topic?.title || slug}
                            </Typography>

                            {/* Teacher create buttons */}
                            <Box sx={{ display: 'flex', gap: 1 }} onClick={e => e.stopPropagation()}>
                                <CreateLessonButton topicSlug={slug} owner={owner} onCreated={handleRefresh} />
                                <CreateChallengeButton topicSlug={slug} owner={owner} onCreated={handleRefresh} />
                                {topicId && (
                                    <CreateCodeChallengeButton topicId={topicId} owner={owner} onCreated={handleRefresh} />
                                )}
                            </Box>
                        </Box>

                        {topic?.description && (
                            <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
                                {topic.description}
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* ── Tab slider ── */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <TabSlider
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        lessonCount={lessons.length}
                        challengeCount={challenges.length}
                        passedCount={passedCount}
                    />
                </Box>

                {/* ── Content panels ── */}
                <Box>
                    {activeTab === 'lessons' && (
                        <LessonsPanel
                            lessons={lessons}
                            owner={owner}
                            topicSlug={slug}
                            onRefresh={handleRefresh}
                        />
                    )}
                    {activeTab === 'challenges' && (
                        <ChallengesPanel
                            challenges={challenges}
                            localPassed={localPassed}
                            onPassed={handlePassed}
                            onRefresh={handleRefresh}
                            topicSlug={slug}
                            topicId={topicId}
                            owner={owner}
                            loading={challengesLoading && !initialLoadDone.current}
                        />
                    )}
                </Box>

            </Box>
        </MainWrapper>
    );
}
