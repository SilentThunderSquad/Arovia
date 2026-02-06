import { useState, useRef, useEffect } from 'react';
import { Box, Avatar, Typography, Paper, Divider, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Edit,
    Lock,
    Logout,
    DeleteForever,
    Add
} from '@mui/icons-material';

const AvatarMenu = ({ user, onEditProfile, onChangePassword, onLogout, onDeleteAccount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const menuItems = [
        { label: 'Edit Profile', icon: <Edit fontSize="small" />, action: onEditProfile, color: 'text.primary' },
        { label: 'Change Password', icon: <Lock fontSize="small" />, action: onChangePassword, color: 'text.primary' },
        { label: 'Logout', icon: <Logout fontSize="small" />, action: onLogout, color: 'error.main' },
        { label: 'Delete Account', icon: <DeleteForever fontSize="small" />, action: onDeleteAccount, color: 'error.dark' },
    ];

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    };

    return (
        <Box sx={{ position: 'relative' }} ref={menuRef}>
            <IconButton
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    p: 0.5,
                    border: '2px solid transparent',
                    '&:hover': { border: '2px solid #FFB703' }, // Accent color
                    transition: 'all 0.2s'
                }}
            >
                <Avatar
                    src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${window.location.origin}${user.profilePicture}`) : ''}
                    alt={user?.name || 'User'}
                    sx={{
                        width: 45,
                        height: 45,
                        bgcolor: '#0F4C5C',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}
                >
                    {getInitials(user?.name)}
                </Avatar>
            </IconButton>

            <AnimatePresence>
                {isOpen && (
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        elevation={4}
                        sx={{
                            position: 'absolute',
                            top: 60,
                            right: 0,
                            width: 240,
                            borderRadius: 2,
                            overflow: 'hidden',
                            zIndex: 1300,
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="subtitle1" fontWeight="bold" noWrap>
                                {user?.name || 'User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box sx={{ py: 1 }}>
                            {menuItems.map((item, index) => (
                                <Box
                                    key={index}
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                    }}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        px: 2,
                                        py: 1.5,
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        color: item.color
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {item.icon}
                                        <Typography variant="body2" fontWeight={500}>
                                            {item.label}
                                        </Typography>
                                    </Box>
                                    <Add fontSize="small" sx={{ color: 'text.disabled', fontSize: 16 }} />
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                )}
            </AnimatePresence>
        </Box>
    );
};

export default AvatarMenu;
