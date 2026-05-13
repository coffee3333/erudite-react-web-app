import * as React from 'react';
import { styled } from '@mui/material/styles';import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Avatar from "@mui/material/Avatar";
import Menu from '@mui/material/Menu';
import useAuthStore from "../../stores/authStore.jsx";
import authService from "../../api/endpoints/authService.jsx";
import {toast} from "react-hot-toast";
import LinksBar from "./LinksBar.jsx";
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { useColorMode } from '../../stores/colorModeStore.jsx';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: 14,
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(108, 142, 255, 0.14)',
    backgroundColor: theme.palette.mode === 'dark'
        ? 'rgba(13, 15, 26, 0.72)'
        : 'rgba(240, 242, 250, 0.82)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    padding: '6px 16px',
}));

export default function HeaderUser() {
    const {user}  = useAuthStore.getState();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { mode, toggleColorMode } = useColorMode();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        await authService.logout();
        setOpen(false);
        toast.success('Successfully logged out!');
        navigate('/');
    }

    return (
        <AppBar
            component="nav"
            aria-label="Site navigation"
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 2,
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <LinksBar />
                    <Box sx={{  display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center',}}>
                        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                            <IconButton size="small" onClick={toggleColorMode} sx={{ opacity: 0.65, '&:hover': { opacity: 1 } }}>
                                {mode === 'dark' ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Open menu">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                                <Avatar
                                    alt={user.username}
                                    src={user.photo || undefined}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        background: user.photo ? 'none' : 'linear-gradient(135deg, #6C8EFF, #B06EFF)',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        color: '#fff',
                                    }}
                                >
                                    {!user.photo && user.username ? user.username[0].toUpperCase() : null}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={() => navigate('/my-profile')}>
                                My Profile
                            </MenuItem>
                            <Divider sx={{ my: 3 }} />
                            <MenuItem onClick={handleLogout}>
                                Log out
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)} aria-label="Close menu">
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem onClick={() => navigate('/courses')}>Courses</MenuItem>
                                <MenuItem onClick={() => navigate('/about-project')}>About Project</MenuItem>
                                <MenuItem onClick={() => navigate('/faq')}>FAQ</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem onClick={() => navigate('/my-profile')}>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={toggleColorMode}>
                                    {mode === 'dark' ? <LightModeOutlinedIcon sx={{ mr: 1, fontSize: '1.1rem' }} /> : <DarkModeOutlinedIcon sx={{ mr: 1, fontSize: '1.1rem' }} />}
                                    {mode === 'dark' ? 'Light mode' : 'Dark mode'}
                                </MenuItem>
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth onClick={handleLogout}>
                                        Log out
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}