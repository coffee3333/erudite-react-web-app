import Container from "@mui/material/Container";
import AppBar from "./AppBar.jsx";
import Footer from "./Footer.jsx";
import * as React from "react";

export default function MainWrapper ({ children }) {
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between' }}>
            <AppBar />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', mt: 16, mb: 5, gap: 4}}
            >
                {children}
            </Container>
            <Footer />
        </Container>
    )
}