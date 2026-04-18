import MainWrapper from "../../components/layout/MainWrapper.jsx";
import { useEffect, useState, useCallback } from "react";
import { Helmet } from 'react-helmet-async';
import useDebounce from "../../hooks/useDebounce.jsx";
import useGetCourses from "../../hooks/courseHooks/useGetCourses.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CourseContentBody from "./components/CourseContentBody.jsx";
import CreateCourseButton from "./components/CreateCourseButton.jsx";
import { Chip, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import courseService from "../../api/endpoints/courseService.jsx";
import useAuthStore from "../../stores/authStore.jsx";

export default function CoursesPage() {
    const [form, setForm] = useState({
        search: '',
        sort_by: 'newest',
        page: 1,
    });
    const [savedOnly, setSavedOnly] = useState(false);
    const [savedCourses, setSavedCourses] = useState([]);
    const [savedLoading, setSavedLoading] = useState(false);
    const user = useAuthStore(s => s.user);

    const debouncedSearch = useDebounce(form.search, 500);
    const { courses, totalCount, fetchCourses, loading } = useGetCourses();
    const [allCourses, setAllCourses] = useState([]);

    useEffect(() => {
        if (savedOnly) return;
        fetchCourses({
            search: debouncedSearch,
            category_id: form.category_id,
            sort_by: form.sort_by,
            page: form.page,
        });
    }, [debouncedSearch, form.category_id, form.sort_by, form.page, savedOnly]);

    useEffect(() => {
        if (savedOnly) return;
        if (form.page === 1) {
            setAllCourses(courses);
        } else {
            setAllCourses((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newOnes = courses.filter((c) => !existingIds.has(c.id));
                return newOnes.length ? [...prev, ...newOnes] : prev;
            });
        }
    }, [courses, form.page, savedOnly]);

    const fetchSaved = useCallback(async () => {
        setSavedLoading(true);
        try {
            const res = await courseService.getBookmarkedCourses();
            setSavedCourses(res?.results ?? res ?? []);
        } catch {
            setSavedCourses([]);
        } finally {
            setSavedLoading(false);
        }
    }, []);

    useEffect(() => {
        if (savedOnly) fetchSaved();
    }, [savedOnly, fetchSaved]);

    const handleLoadMore = () => {
        setForm((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    const displayedCourses = savedOnly ? savedCourses : allCourses;
    const moreAvailable = savedOnly ? false : allCourses.length < totalCount;
    const isLoading = savedOnly ? savedLoading : loading;

    return (
        <MainWrapper>
            <Helmet>
                <title>All Courses — Erudite</title>
                <meta name="description" content="Browse all available courses on Erudite. Learn coding, math, and more through interactive challenges and lessons." />
            </Helmet>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                            {savedOnly ? 'Saved Courses' : 'All Courses'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {savedOnly
                                ? `${savedCourses.length} bookmarked course${savedCourses.length !== 1 ? 's' : ''}`
                                : totalCount > 0 ? `${totalCount} course${totalCount !== 1 ? 's' : ''} available` : 'Explore our library'}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                        {!savedOnly && (
                            <TextField
                                size="small"
                                placeholder="Search courses…"
                                value={form.search}
                                onChange={(e) => setForm((p) => ({ ...p, search: e.target.value, page: 1 }))}
                                inputProps={{ 'aria-label': 'Search courses' }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ fontSize: '1rem', opacity: 0.5 }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: 200,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        background: 'rgba(108,142,255,0.06)',
                                        fontSize: '0.875rem',
                                        '& fieldset': { borderColor: 'rgba(108,142,255,0.15)' },
                                        '&:hover fieldset': { borderColor: 'rgba(108,142,255,0.35)' },
                                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                                    },
                                }}
                            />
                        )}
                        {user && (
                            <Chip
                                icon={<BookmarkIcon sx={{ fontSize: '0.9rem !important' }} />}
                                label="Saved"
                                size="small"
                                onClick={() => setSavedOnly(v => !v)}
                                sx={{
                                    fontWeight: 600, fontSize: '0.78rem',
                                    background: savedOnly ? 'rgba(108,142,255,0.18)' : 'rgba(108,142,255,0.07)',
                                    color: savedOnly ? 'primary.light' : 'text.secondary',
                                    border: `1px solid ${savedOnly ? 'rgba(108,142,255,0.4)' : 'rgba(108,142,255,0.15)'}`,
                                    cursor: 'pointer',
                                    '& .MuiChip-icon': { color: savedOnly ? 'primary.light' : 'inherit' },
                                    transition: 'all 0.15s',
                                }}
                            />
                        )}
                        <CreateCourseButton />
                    </Box>
                </Box>

                <CourseContentBody
                    allCourses={displayedCourses}
                    handleLoadMore={handleLoadMore}
                    moreAvailable={moreAvailable}
                    loading={isLoading}
                />
            </Box>
        </MainWrapper>
    );
}
