import * as React from "react";
import { useState } from "react";
import {
    IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, TextField, CircularProgress,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import useUpdateTopic from "../../../../hooks/topicHooks/useUpdateTopic.jsx";

export default function UpdateTopicButton({ slug, owner, initialTitle, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(initialTitle || "");
    const { loading, updateTopic } = useUpdateTopic();

    if (!useIsOwner({ owner })) return null;

    const handleClose = () => {
        setOpen(false);
        setTitle(initialTitle || "");
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        try {
            await updateTopic({ slug, title });
            onUpdated?.();
            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Tooltip title="Edit topic">
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

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Edit Topic</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        autoFocus fullWidth margin="dense"
                        label="Topic Title" variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} size="small">Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        size="small"
                        disabled={!title.trim() || title === initialTitle || loading}
                        endIcon={loading ? <CircularProgress color="inherit" size={14} /> : null}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
