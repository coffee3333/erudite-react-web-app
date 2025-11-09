import * as React from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField, CircularProgress,
} from "@mui/material";
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import useCreateTopic from "../../../../hooks/topicHooks/useCreateTopic.jsx";

export default function CreateTopicButton({ slug, owner, onCreated }) {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const { loading, createTopic  } = useCreateTopic();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setTitle("");
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;

        try {
            await createTopic({ slug, title });
            onCreated?.(); // 🔹 триггерим обновление списка
            handleClose();
        } catch (err) {
            console.error("Error creating topic:", err);
        }
    };

    if (!useIsOwner(owner = {owner})) return null;

    return (
        <>
            <Button
                color="primary"
                variant="outlined"
                fullWidth
                onClick={handleOpen}
                sx={{ mb: 2 }}
            >
                Create Topic
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Topic</DialogTitle>
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
                        disabled={!title.trim()}
                        endIcon={
                            loading ? (
                                <CircularProgress color="inherit" size={18} />
                            ) : null
                        }
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
