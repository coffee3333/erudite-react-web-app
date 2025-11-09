import MainPage from "../MainPage/MainPage.jsx";
import MainWrapper from "../../components/layout/MainWrapper.jsx";
import {useEffect, useState} from "react";
import useDebounce from "../../hooks/useDebounce.jsx";
import useGetCourses from "../../hooks/courseHooks/useGetCourses.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CourseCard from "../../components/common/CourseCard.jsx";
import CourseContentBody from "./components/CourseContentBody.jsx";
import CreateCourseButton from "./components/CreateCourseButton.jsx";


export default function CoursesPage(){
    const [form, setForm] = useState({
        search: '',
        level: null,
        sort_by: 'newest',
        page: 1,
    });

    const debouncedSearch = useDebounce(form.search, 500);
    const { courses, totalCount, fetchCourses, loading } = useGetCourses();
    const [allCourses, setAllCourses] = useState([]);

    const handleFormChange = (newValues) => {
        setForm((prev) => ({
            ...prev,
            ...newValues,
        }));
    };

    useEffect(() => {
        console.log('Fetching posts with:', {
            search: debouncedSearch,
            category_id: form.category_id,
            sort_by: form.sort_by,
            page: form.page,
        });
        fetchCourses({
            search: debouncedSearch,
            category_id: form.category_id,
            sort_by: form.sort_by,
            page: form.page,
        });
    }, [debouncedSearch, form.category_id, form.sort_by, form.page]);

    useEffect(() => {
        if (form.page === 1) {
            setAllCourses(courses);
        } else {
            setAllCourses((prev) => [
                ...prev,
                ...courses.filter((c) => !prev.find((p) => p.id === c.id)),
            ]);
        }
    }, [courses, form.page]);

    const handleLoadMore = () => {
        setForm((prev) => ({ ...prev, page: prev.page + 1 }));
    };

    const moreAvailable = allCourses.length < totalCount;

    return (
        <MainWrapper>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>
                    <Typography variant="h1" gutterBottom>
                        Some title
                    </Typography>
                    <Typography>some bullshit</Typography>
                </div>
                <CreateCourseButton />

                {/*<MainContentHeader formValues={form} onChangeForm={handleFormChange} />*/}
                {/*<MainContentBody allPosts={allCourses} handleLoadMore={handleLoadMore} moreAvailable={moreAvailable} totalCount={form.count} loading={loading} />*/}
                <CourseContentBody allCourses={allCourses} handleLoadMore={handleLoadMore} moreAvailable={moreAvailable} totalCount={form.count} loading={loading} />
            </Box>
        </MainWrapper>
    );
}