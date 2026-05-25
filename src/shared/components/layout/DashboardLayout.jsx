'use strict';

import { useState } from 'react';
import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import Topbar from './Topbar';

const DashboardLayout = ({ user, title, subtitle, onLogout, sidebarComponent: SidebarComponent, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 260;
  const collapsedWidth = 76;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F9FA' }}>
      
      {/* 1. Mobile Drawer Overlay */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better mobile performance
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              boxShadow: '8px 0 24px rgba(0,0,0,0.08)'
            },
          }}
        >
          <SidebarComponent 
            isCollapsed={false}
            setIsCollapsed={() => {}}
            onCloseMobile={handleDrawerToggle}
          />
        </Drawer>
      ) : (
        // 2. Desktop Collapsible Sidebar Container
        <Box 
          sx={{ 
            width: isCollapsed ? collapsedWidth : drawerWidth, 
            flexShrink: 0,
            transition: 'width 0.2s ease-in-out',
            borderRight: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <SidebarComponent 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </Box>
      )}

      {/* 3. Main Dashboard Wrapper */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          width: '0', // Prevents flex column layout overflows
          minHeight: '100vh'
        }}
      >
        <Topbar 
          title={title}
          subtitle={subtitle}
          user={user}
          onLogout={onLogout}
          onToggleMobileSidebar={handleDrawerToggle}
        />

        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2.5, md: 4 }, 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
