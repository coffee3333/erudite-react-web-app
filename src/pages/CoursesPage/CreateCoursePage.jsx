import MainWrapper from "../../components/layout/MainWrapper.jsx";
import useIsAllowed from "../../hooks/permissionHooks/useIsAllowed.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import CourseForm from "./components/CourseForm.jsx";
import useCreateCourse from "../../hooks/courseHooks/useCreateCourse.jsx";


export default function CreateCoursePage() {
    const navigate = useNavigate();
    const isAllowed = useIsAllowed();
    const { createCourse, loading } = useCreateCourse();

    useEffect(() => {
        if ( !isAllowed ) {
            navigate('/sign-in');
        }
    }, [isAllowed, navigate]);

    const handleSubmit = async (formData) => {
        try {
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            const slug = await createCourse(formData);
            navigate('/course/' + slug);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MainWrapper>
            <CourseForm onSubmit={handleSubmit} loading={loading} />
        </MainWrapper>
    );
}