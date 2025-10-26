import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import AppAppBar from "../../components/common/AppAppBar.jsx"
import SliderBar from "../../components/common/SliderBar.jsx";

export default function LandingPage() {
    return (
        <>
            <AppAppBar position="static"/>
            <Container maxWidth="md" sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h2" gutterBottom>
                    Welcome to My Landing 🚀
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                    This is a simple landing page built with React and MUI.
                    You can place your product or company introduction here.
                </Typography>
                <Button variant="contained" size="large">
                    Get Started
                </Button>
            </Container>

            <SliderBar />



            <Box sx={{ bgcolor: "primary.main", color: "white", py: 2, mt: 5, textAlign: "center" }}>
                <Typography variant="body1">© 2025 My Landing</Typography>
            </Box>
        </>
    );
}