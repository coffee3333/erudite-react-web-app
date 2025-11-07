import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function DissatisfiedIcon({ text = "Something went wrong", description = "Please, try again later", size = 100 }) {
    return (
        <Box
            sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 2,
                color: 'text.secondary',
            }}
        >
            <SentimentDissatisfiedIcon sx={{ fontSize: size, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                {text}
            </Typography>
            <Typography variant="body1">
                {description}
            </Typography>
        </Box>
    );
}