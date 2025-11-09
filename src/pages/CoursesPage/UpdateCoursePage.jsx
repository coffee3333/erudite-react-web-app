import {useParams, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import toast from "react-hot-toast";
import useIsAllowed from "../../hooks/permissionHooks/useIsAllowed.jsx";
import useUpdateCourse from "../../hooks/courseHooks/useUpdateCourse.jsx";
import CourseForm from "./components/CourseForm.jsx";
import MainWrapper from "../../components/layout/MainWrapper.jsx";

export default function UpdateCoursePage () {
    const { state } = useLocation();
    const { slug } = useParams();
    const navigate = useNavigate();
    const isAllowed = useIsAllowed();
    const { updateCourse, loading } = useUpdateCourse(slug);

    useEffect(() => {
        if ( !isAllowed ) {
            toast.error("Something went wrong");
            navigate(-1);
        }
    }, [isAllowed, navigate]);

    const handleSubmit = async (formData) => {
        try {
            console.log("Updating");
            console.log("Image file:", formData.get("featured_image"));
            const ok = await updateCourse(formData);
            if (ok) {
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const initialData = {
        title: (state?.course.title || ""),
        description: (state?.course.description || ""),
        level: (state?.course.level || "beginner"),
        language: (state?.course.language || "en"),
        featured_image: (state?.course.featured_image || null),
        status: (state?.course.status || "draft")
    }

    return (
        <MainWrapper>
            <CourseForm onSubmit={handleSubmit} loading={loading} initialData={initialData} />
        </MainWrapper>
    )

}