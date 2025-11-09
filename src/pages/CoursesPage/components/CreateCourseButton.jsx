import * as React from "react";
import {
    Button,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import useIsAllowed from "../../../hooks/permissionHooks/useIsAllowed.jsx";

export default function CreateCourseButton() {
    const navigate = useNavigate();

    if (!useIsAllowed()) return null;

    return (
        <>
            <Button
                color="primary"
                variant="outlined"
                fullWidth
                onClick={() => navigate("/create-course")}
                sx={{ mb: 2 }}
            >
                Create Course
            </Button>
        </>
    );
}
