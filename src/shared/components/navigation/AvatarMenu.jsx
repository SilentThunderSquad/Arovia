'use strict';

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, IconButton, MenuItem, Paper, Typography } from '@mui/material';
import { ArrowForwardIos, Logout, Person, Settings } from '@mui/icons-material';

import { AnimatePresence, motion } from 'framer-motion';

import { getProfilePath, getSettingsPath } from '@shared/utils/roleRoutes';

const AvatarMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = user?.role || 'user';
  const slug = user?.username || user?.name?.toLowerCase().replace(/\s+/g, '') || 'user';
  const profilePath = getProfilePath(role, slug);
  const settingsPath = getSettingsPath(role);

  const menuItems = [
    { 
      label: 'My Profile', 
      icon: <Person fontSize="small" sx={{ color: '#0F4C5C' }} />, 
      action: () => navigate(profilePath), 
      color: 'text.primary' 
    },
    { 
      label: 'Settings', 
      icon: <Settings fontSize="small" sx={{ color: '#0F4C5C' }} />, 
      action: () => navigate(settingsPath), 
      color: 'text.primary' 
    },
    { 
      label: 'Logout', 
      icon: <Logout fontSize="small" sx={{ color: '#e63946' }} />, 
      action: onLogout, 
      color: '#e63946' 
    },
  ];

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  };

  // Safe google avatar resolution with default initials fallback
  const avatarSrc = user?.profilePicture || '';

  return (
    <Box sx={{ position: 'relative' }} ref={menuRef}>
      <IconButton 
        onClick={() => setIsOpen(!isOpen)} 
        sx={{ 
          p: 0.5, 
          border: '2px solid transparent', 
          '&:hover': { border: '2px solid #2EC4B6' }, 
          transition: 'all 0.2s ease-in-out' 
        }}
      >
        <Avatar 
          src={avatarSrc} 
          alt={user?.name || 'User'} 
          sx={{ 
            width: 42, 
            height: 42, 
            bgcolor: '#0F4C5C', 
            fontSize: '1rem', 
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(15, 76, 92, 0.15)'
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
            transition={{ duration: 0.15, ease: 'easeOut' }} 
            elevation={4} 
            sx={{ 
              position: 'absolute', 
              top: 52, 
              right: 0, 
              width: 240, 
              borderRadius: 3, 
              overflow: 'hidden', 
              zIndex: 1300, 
              bgcolor: 'background.paper',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0,0,0,0.06)'
            }}
          >
            <Box sx={{ p: 2, bgcolor: '#F8F9FA' }}>
              <Typography variant="subtitle2" fontWeight="700" color="text.primary" noWrap>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                {user?.email}
              </Typography>
              <Typography variant="caption" sx={{ display: 'inline-block', mt: 0.5, px: 1, py: 0.25, borderRadius: 1.5, bgcolor: 'rgba(46, 196, 182, 0.1)', color: '#2EC4B6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {role}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ py: 0.5 }}>
              {menuItems.map((item, index) => (
                <MenuItem 
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
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }, 
                    color: item.color 
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {item.icon}
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <ArrowForwardIos sx={{ color: 'text.disabled', fontSize: 10 }} />
                </MenuItem>
              ))}
            </Box>
          </Paper>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AvatarMenu;
