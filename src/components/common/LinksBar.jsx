import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";
import {useNavigate} from "react-router-dom";
import Logo from "./Logo.jsx";


export default function LinksBar(){
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Logo/>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Button variant="text" color="info" size="small" onClick={() => navigate('/courses')}>
                    Courses
                </Button>
                <Button variant="text" color="info" size="small" onClick={() => navigate('/about-project')}>
                    About Project
                </Button>
                <Button variant="text" color="info" size="small" sx={{ minWidth: 0 }} onClick={() => navigate('/faq')}>
                    FAQ
                </Button>
            </Box>
        </Box>
    );
}