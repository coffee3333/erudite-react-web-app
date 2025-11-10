// src/components/challenges/ChallengeCard.jsx
import * as React from "react";
import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Container,
    Box,
    Divider,
    Chip, InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function ChallengeCard({ index, challenge }) {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 2,
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.06)",
                },
            }}
        >
            {/*<CardActionArea onClick={() => (console.log(challenge))}>*/}
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        >
                            Exercise {index + 1}:  {challenge.title}
                        </Typography>


                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", maxWidth: 170, gap: 1 }}>
                            <Chip
                                label={`${challenge.points} pts`}
                                size="small"
                                sx={{
                                    border: "1px solid rgba(255,255,255,0.2)",
                                    background: "transparent",
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            />

                            <Chip
                                label={challenge.difficulty}
                                size="small"
                                color={
                                    challenge.difficulty === "easy"
                                        ? "success"
                                        : challenge.difficulty === "hard"
                                            ? "error"
                                            : "warning"
                                }
                                sx={{
                                    textTransform: "capitalize",
                                    fontWeight: 500,
                                }}
                            />
                        </Box>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{
                            opacity: 0.8,
                            mt: 1,
                            mb: 1,
                        }}
                    >
                        {challenge.body.length > 100
                            ? challenge.body.slice(0, 100) + "..."
                            : challenge.body}
                    </Typography>

                    <Divider />

                    <TextField
                        required
                        id="title-post"
                        hiddenLabel
                        name="answer"
                        size="small"
                        variant="outlined"
                        fullWidth
                        aria-label="Enter the title of a post"
                        placeholder="Answer"
                        // value={form.title}
                        // onChange={handleChange}
                        // error={!!errors.title}
                        // helperText={errors.title}
                    />
                    <Button
                        type="submit"
                        variant="outlined"
                        fullWidth
                        // disabled={Object.keys(errors).length > 0}
                        title="Submit the form"
                        // endIcon={
                        //     loading ? (
                        //         <CircularProgress color="inherit" size={18} />
                        //     ) : null
                        // }
                    >
                        Submit answer
                    </Button>
                </CardContent>
            {/*</CardActionArea>*/}
        </Card>
    );
}
