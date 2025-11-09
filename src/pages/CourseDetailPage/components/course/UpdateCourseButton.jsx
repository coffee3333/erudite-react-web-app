import * as React from "react";
import {
    Button,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";


export default function UpdateCourseButton( { slug, owner, course } ) {
    const navigate = useNavigate();

    if (!useIsOwner(owner = {owner})) return null;

    return (
        <>
            <Button
                color="primary"
                variant="outlined"
                onClick={() => navigate(`/course-edit/${slug}`, { state: { course } })}
                endIcon={<EditIcon />}
            >
                Update
            </Button>
        </>
    );
}
