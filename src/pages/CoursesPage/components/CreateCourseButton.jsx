import * as React from 'react';
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import useIsAllowed from '../../../hooks/permissionHooks/useIsAllowed.jsx';
import useCreateCourse from '../../../hooks/courseHooks/useCreateCourse.jsx';
import CourseFormDialog from './CourseFormDialog.jsx';

export default function CreateCourseButton({ onCreated }) {
    const [open, setOpen] = useState(false);
    const { createCourse, loading } = useCreateCourse();
    const navigate = useNavigate();
    const isAllowed = useIsAllowed();

    if (!isAllowed) return null;

    const handleSubmit = async (formData) => {
        const slug = await createCourse(formData);
        if (slug) {
            setOpen(false);
            onCreated?.();
            navigate(`/course/${slug}`);
        }
    };

    return (
        <>
            <Tooltip title="Create course">
                <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    sx={{
                        border: '1px solid rgba(108,142,255,0.3)',
                        borderRadius: 1.5,
                        color: 'primary.light',
                        '&:hover': { background: 'rgba(108,142,255,0.1)', borderColor: 'primary.main' },
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <CourseFormDialog
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                loading={loading}
            />
        </>
    );
}
