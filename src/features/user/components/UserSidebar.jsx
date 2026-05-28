'use strict';

import { 
  Box, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, IconButton, Tooltip, Typography 
} from '@mui/material';
import { 
  ChevronLeft, Menu as MenuIcon, Dashboard, 
  Person, LocationOn, Description, Security, Settings, Warning 
} from '@mui/icons-material';

const drawerWidth = 260;
const collapsedWidth = 76;

const UserSidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, onCloseMobile }) => {
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sections = [
    {
      title: 'MAIN',
      items: [
        { id: 'overview', label: 'Overview', icon: <Dashboard /> }
      ]
    },
    {
      title: 'HEALTH',
      items: [
        { id: 'prescriptions', label: 'Prescriptions', icon: <Description /> }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile Options', icon: <Person /> },
        { id: 'settings', label: 'Account Settings', icon: <Settings /> }
      ]
    },
    {
      title: 'SECURITY',
      items: [
        { id: 'security', label: 'Security Panel', icon: <Security /> }
      ]
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FFFFFF' }}>
      {/* Header Logo branding and toggle */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between', 
          px: 2.5,
          py: 2.5,
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        {!isCollapsed && (
          <Typography 
            variant="h6" 
            fontWeight="900" 
            sx={{ 
              color: '#0F4C5C', 
              letterSpacing: '-1px',
              fontFamily: '"Poppins", sans-serif'
            }}
          >
            Arovia
          </Typography>
        )}
        <IconButton onClick={handleToggle} sx={{ color: '#0F4C5C' }}>
          {isCollapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Grouped Sidebar List */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 3, px: 2 }}>
        {sections.map((section, sIdx) => (
          <Box key={sIdx} sx={{ mb: 3 }}>
            {!isCollapsed && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.disabled', 
                  fontWeight: 800, 
                  px: 2, 
                  display: 'block', 
                  mb: 1.5,
                  letterSpacing: '1px'
                }}
              >
                {section.title}
              </Typography>
            )}
            <List disablePadding>
              {section.items.map((item) => {
                const isSelected = activeView === item.id;
                return (
                  <Tooltip 
                    key={item.id} 
                    title={isCollapsed ? item.label : ''} 
                    placement="right"
                    arrow
                  >
                    <ListItem disablePadding sx={{ mb: 0.5 }}>
                      <ListItemButton
                        onClick={() => {
                          setActiveView(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        sx={{
                          minHeight: 48,
                          justifyContent: isCollapsed ? 'center' : 'initial',
                          px: 2,
                          borderRadius: 2,
                          bgcolor: isSelected ? 'rgba(15, 76, 92, 0.06)' : 'transparent',
                          color: isSelected ? '#0F4C5C' : '#6b7280',
                          '&:hover': {
                            bgcolor: isSelected ? 'rgba(15, 76, 92, 0.1)' : 'rgba(0,0,0,0.02)',
                            color: '#0F4C5C'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: isCollapsed ? 0 : 2,
                            justifyContent: 'center',
                            color: isSelected ? '#2EC4B6' : '#9ca3af',
                            transition: 'color 0.2s'
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText 
                            primary={item.label} 
                            primaryTypographyProps={{ 
                              fontWeight: isSelected ? 700 : 600,
                              fontSize: '0.85rem'
                            }} 
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default UserSidebar;
