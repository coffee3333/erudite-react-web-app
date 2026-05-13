import * as React from 'react';
import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useIsOwner from '../../../../hooks/permissionHooks/useIsOwner.jsx';
import useUpdateCourse from '../../../../hooks/courseHooks/useUpdateCourse.jsx';
import CourseFormDialog from '../../../CoursesPage/components/CourseFormDialog.jsx';

export default function UpdateCourseButton({ slug, owner, course, onUpdated }) {
    const [open, setOpen] = useState(false);
    const { updateCourse, loading } = useUpdateCourse(slug);
    const isOwner = useIsOwner({ owner });

    if (!isOwner) return null;

    const handleSubmit = async (formData) => {
        const ok = await updateCourse(formData);
        if (ok) {
            setOpen(false);
            onUpdated?.();
        }
    };

    return (
        <>
            <Tooltip title="Edit course">
                <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    sx={{
                        border: '1px solid rgba(108,142,255,0.25)',
                        borderRadius: 1.5,
                        color: 'primary.light',
                        '&:hover': { background: 'rgba(108,142,255,0.1)', borderColor: 'primary.main' },
                    }}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <CourseFormDialog
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleSubmit}
                loading={loading}
                initialData={course}
            />
        </>
    );
}
