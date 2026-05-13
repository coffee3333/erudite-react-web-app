import * as React from "react";
import { useState } from "react";
import {
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import useDeleteTopic from "../../../../hooks/topicHooks/useDeleteTopic.jsx";

export default function DeleteTopicButton({ slug_topic, owner, onDeleted }) {
    const [open, setOpen] = useState(false);
    const { loading, deleteTopic } = useDeleteTopic();

    if (!useIsOwner({ owner })) return null;

    const handleDelete = async () => {
        try {
            await deleteTopic({ slug_topic });
            onDeleted?.();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Tooltip title="Delete topic">
                <IconButton
                    size="small"
                    onClick={() => setOpen(true)}
                    sx={{
                        border: '1px solid rgba(244,67,54,0.25)',
                        borderRadius: 1.5,
                        color: 'error.light',
                        '&:hover': { background: 'rgba(244,67,54,0.08)', borderColor: 'error.main' },
                    }}
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Delete topic?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ opacity: 0.75 }}>
                        This will permanently delete the topic and all its challenges. This cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} size="small">Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={loading}
                    >
                        {loading ? 'Deleting…' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
