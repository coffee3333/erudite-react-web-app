import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    InputLabel,
    Select,
    Typography,
    CircularProgress,
    FormHelperText,
} from "@mui/material";


export default function CourseForm({ onSubmit, loading, initialData = null }) {
    const [form, setForm] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        level: initialData?.level || "",
        language: initialData?.language || "en",
        featured_image: initialData?.featured_image || null,
        status: initialData?.status || "published",
    });
    const [errors, setErrors] = useState({});
    const [imagePreviewUrl, setImagePreviewUrl] = useState(initialData?.featured_image || null);
    const [imageError, setImageError] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false);

    const validate = (fields = form) => {
        const newErrors = {};
        if (!fields.title.trim()) newErrors.title = "Title is required";
        if (!fields.description.trim()) newErrors.description = "Description is required";
        if (!fields.level) newErrors.level = "Level is required";
        if (!fields.status) newErrors.status = "Status is required";
        return newErrors;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0] || null;
        setImageError(null);
        setIsImageChanged(true);

        if (file) {
            if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
                setImageError("Only JPEG and PNG images are allowed");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setImageError("File size must not exceed 5MB");
                return;
            }

            setForm((prev) => ({
                ...prev,
                featured_image: file,
            }));
            const url = URL.createObjectURL(file);
            setImagePreviewUrl(url);
        } else {
            setForm((prev) => ({
                ...prev,
                featured_image: null,
            }));
            setImagePreviewUrl(null);
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({
            ...prev,
            featured_image: null,
        }));
        setImagePreviewUrl(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            setErrors(validate(updated));
            return updated;
        });
    };

    const handleDescriptionChange = (e) => {
        const description = e.target.value;
        setForm((prev) => {
            const updated = { ...prev, description };
            setErrors(validate(updated));
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const foundErrors = validate();
        setErrors(foundErrors);
        if (Object.keys(foundErrors).length > 0) return;

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("level", form.level);
        if (isImageChanged) {
            if (form.featured_image instanceof File) {
                formData.append("featured_image", form.featured_image);
            } else if (form.featured_image === null && initialData?.featured_image) {
                formData.append("featured_image", null);
            }
        }
        formData.append("status", form.status);

        onSubmit(formData);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                maxWidth: 1250,
                mx: "auto",
                p: { xs: 2, sm: 3, md: 4 },
                bgcolor: "background.paper",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 4,
            }}
        >
            <Typography variant="h6">{!initialData ? "Create New Course" : "Update Course"}</Typography>

            <div>
                <InputLabel htmlFor="level-select" id="level-label">
                    Level
                </InputLabel>
                <Select
                    id="level-select"
                    name="level"
                    variant="outlined"
                    value={form.level}
                    onChange={handleChange}
                    labelId="level-label"
                    title="Choose a difficulty level"
                    fullWidth
                    error={!!errors.level}
                >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                </Select>

                {errors.level && <FormHelperText error>{errors.level}</FormHelperText>}
            </div>

            <div>
                <InputLabel htmlFor="title-course">Title</InputLabel>
                <TextField
                    required
                    id="title-course"
                    hiddenLabel
                    name="title"
                    size="small"
                    variant="outlined"
                    fullWidth
                    aria-label="Enter the title of a course"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                />
            </div>

            <div>
                {imagePreviewUrl ? null :
                    <Button
                        aria-label="Upload featured image"
                        variant="outlined"
                        component="label"
                        title="Upload a featured image for your course"
                        fullWidth
                    >
                        Upload Featured Image
                        <input type="file" aria-label="Upload featured image" hidden onChange={handleFileChange} accept="image/*" />
                    </Button>
                }

                {imageError && <FormHelperText error>{imageError}</FormHelperText>}
                {imagePreviewUrl && (
                    <Box
                        sx={{
                            mt: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                maxWidth: 300,
                                maxHeight: 400,
                                borderRadius: 2,
                                overflow: 'hidden',
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                '& img': {
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease-in-out',
                                    '&:hover': { transform: 'scale(1.02)' },
                                },
                            }}
                        >
                            <img
                                src={imagePreviewUrl}
                                alt="Featured image preview"
                                style={{
                                    maxWidth: "300px",
                                    maxHeight: "200px",
                                    objectFit: "contain",
                                    borderRadius: "4px",
                                    display: "block",
                                    margin: "0 auto",
                                }}
                            />
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleRemoveImage}
                            fullWidth
                        >
                            Remove Image
                        </Button>
                    </Box>
                )}
            </div>

            <div>
                <InputLabel id="desc-label">Description</InputLabel>
                <TextField
                    id="content"
                    name="content"
                    value={form.description}
                    onChange={handleDescriptionChange}
                    multiline
                    minRows={4}        // 👈 starting height
                    maxRows={10}       // 👈 grows up to 10 rows
                    fullWidth
                    variant="outlined"
                    placeholder="Enter your text here..."
                    error={!!errors.description}
                    helperText={errors.description}
                />
            </div>

            <div>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    label="Status"
                    labelId="status-label"
                    title="Set the status: published or draft"
                    fullWidth
                >
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                </Select>
                {errors.status && <FormHelperText error>{errors.status}</FormHelperText>}
            </div>

            <Button
                type="submit"
                variant="outlined"
                disabled={Object.keys(errors).length > 0}
                title="Submit the form"
                endIcon={
                    loading ? (
                        <CircularProgress color="inherit" size={18} />
                    ) : null
                }
            >
                {!initialData ? "Create New Course" : "Update Course"}
            </Button>
        </Box>
    );
}