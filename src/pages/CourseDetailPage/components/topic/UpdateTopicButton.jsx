import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField, CircularProgress,
} from "@mui/material";
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import useUpdateTopic from "../../../../hooks/topicHooks/useUpdateTopic.jsx";
import EditIcon from '@mui/icons-material/Edit';
import {useState, useEffect} from "react";


export default function UpdateTopicButton({ slug, owner, initialTitle, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(initialTitle || "");
    const [newTitle, setNewTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { loading, updateTopic } = useUpdateTopic();

    const handleOpen = (e) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = (e) => {
        e?.stopPropagation?.();
        setOpen(false);
        setTitle(initialTitle || "");
    };

    const handleSubmit = () => {
        if (!title.trim()) return;

        setNewTitle(title);
        setSubmitting(true);
        handleClose();
    };

    useEffect(() => {
        if (!open && submitting) {
            const doUpdate = async () => {
                try {
                    await updateTopic({ slug, title: newTitle });
                    onUpdated?.();
                } catch (err) {
                    console.error("Error updating topic:", err);
                } finally {
                    setSubmitting(false);
                    setNewTitle("");
                }
            };
            doUpdate();
        }
    }, [open, submitting, slug, newTitle, updateTopic, onUpdated]);

    if (!useIsOwner({ owner })) return null;

    return (
        <>
            <Button
                color="primary"
                variant="outlined"
                onClick={handleOpen}
                endIcon={loading ? <CircularProgress color="inherit" size={18} /> : <EditIcon />}
                disabled={loading}
            >
                Update
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Update Topic</DialogTitle>
                <DialogContent sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Topic Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!title.trim() || loading}
                        endIcon={
                            loading ? (
                                <CircularProgress color="inherit" size={18} />
                            ) : null
                        }
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}