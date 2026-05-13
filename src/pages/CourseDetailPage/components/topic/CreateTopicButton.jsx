import * as React from "react";
import {
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, CircularProgress, IconButton, Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useIsOwner from "../../../../hooks/permissionHooks/useIsOwner.jsx";
import useCreateTopic from "../../../../hooks/topicHooks/useCreateTopic.jsx";

export default function CreateTopicButton({ slug, owner, onCreated }) {
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const { loading, createTopic } = useCreateTopic();

    if (!useIsOwner({ owner })) return null;

    const handleClose = () => { setOpen(false); setTitle(""); };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        try {
            await createTopic({ slug, title });
            onCreated?.();
            handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <Tooltip title="Add topic">
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
                    <AddIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>New Topic</DialogTitle>
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
                        disabled={!title.trim() || loading}
                        endIcon={loading ? <CircularProgress color="inherit" size={14} /> : null}
                    >
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
