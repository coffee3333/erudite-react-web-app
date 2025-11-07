import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import Logo from "./Logo.jsx";
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import Avatar from "@mui/material/Avatar";
import Menu from '@mui/material/Menu';
import useAuthStore from "../../stores/authStore.jsx";
import {toast} from "react-hot-toast";
import LinksBar from "./LinksBar.jsx";


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: '8px 12px',
}));

export default function HeaderUser() {
    const {user}  = useAuthStore.getState();
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = () => { //change it, use a logout with backend
        useAuthStore.getState().logout();
        setOpen(false);
        toast.success('Successfully logged out!')
        navigate('/');
    }

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <LinksBar />
                    <Box sx={{  display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center',}}>
                        <Tooltip title="Open menu">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: 'none' }}>
                                <Avatar alt={user.username} src={user.photo} sx={{ border: 'none', textTransform: 'uppercase'}} />
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
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>
                                <MenuItem onClick={() => navigate('/about-project')}>About Project</MenuItem>
                                <MenuItem onClick={() => navigate('/faq')}>FAQ</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem onClick={() => navigate('/my-profile')}>
                                    My Profile
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