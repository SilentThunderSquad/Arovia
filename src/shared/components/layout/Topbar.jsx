'use strict';

import { Box, Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AvatarMenu from '@shared/components/navigation/AvatarMenu';
import SessionTimer from '@shared/components/layout/SessionTimer';

const Topbar = ({ title, subtitle, user, onLogout, onToggleMobileSidebar }) => {
  return (
    <Box 
      sx={{ 
        height: 70, 
        bgcolor: '#FFFFFF', 
        borderBottom: '1px solid rgba(0,0,0,0.06)', 
        px: { xs: 2, md: 4 }, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      {/* Left side: Mobile menu trigger & Headings */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {onToggleMobileSidebar && (
          <IconButton 
            onClick={onToggleMobileSidebar} 
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#0F4C5C' }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Box>
          <Typography 
            variant="h6" 
            fontWeight="800" 
            sx={{ 
              color: '#0F4C5C', 
              letterSpacing: '-0.5px',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Right side: Session Timer, user initials & menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <SessionTimer onSessionExpire={onLogout} />
        
        <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
          <Typography 
            variant="subtitle2" 
            fontWeight="700" 
            color="text.primary"
            sx={{ fontSize: '0.85rem' }}
          >
            {user?.name || 'Healthy User'}
          </Typography>
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ display: 'block', fontSize: '0.75rem' }}
          >
            {user?.role === 'admin' ? 'Administrator' : 'Verified Member'}
          </Typography>
        </Box>

        <AvatarMenu user={user} onLogout={onLogout} />
      </Box>
    </Box>
  );
};

export default Topbar;
