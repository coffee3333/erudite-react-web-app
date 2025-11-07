import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React, {useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import {Paper} from "@mui/material";
import Stack from "@mui/material/Stack";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '1px solid hsl(220, 20%, 25%)',
    boxShadow: 24,
    p: 4,
};

export default function DeleteModal({handleDelete, loading, success}) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} variant="outlined" endIcon={<DeleteIcon />}>Delete</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Paper elevation={0} sx={style}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <Typography
                            variant="h6"
                            align="center"
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Are you sure you want to delete this?
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="error" onClick={handleDelete} disabled={loading}>
                                {success ? "Yes, delete" : loading ? "Deleting..." : "Deleted"}
                            </Button>
                            <Button variant="outlined" color="primary" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Modal>
        </div>
    );
}