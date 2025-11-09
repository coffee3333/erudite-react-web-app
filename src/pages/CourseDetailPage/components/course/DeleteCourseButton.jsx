import * as React from "react";
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import DeleteModal from "../../../../components/common/DeleteModal.jsx";
import useDeleteCourse from "../../../../hooks/courseHooks/useDeleteCourse.jsx";


export default function DeleteCourseButton({ slug, owner, onDeleted }) {
    const { loading, deleteCourse  } = useDeleteCourse();


    const handleDelete = async () => {
        try {
            await deleteCourse({slug});
            onDeleted?.();
        } catch (err) {
            console.error("Error creating topic:", err);
        }
    };

    if (!useIsOwner(owner = {owner})) return null;

    return (
        <>
            <DeleteModal handleDelete={handleDelete} loading={loading} />
        </>
    );
}
