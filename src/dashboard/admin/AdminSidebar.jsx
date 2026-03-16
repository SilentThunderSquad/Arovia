
import { 
    Box, 
    Drawer, 
    List, 
    ListItem, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText, 
    IconButton, 
    Tooltip,
    Divider
} from '@mui/material';
import { 
    ChevronLeft, 
    Menu as MenuIcon,
    PieChart, 
    PeopleAlt 
} from '@mui/icons-material';

const drawerWidth = 240;
const collapsedWidth = 72;

const AdminSidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed }) => {
    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: <PieChart /> },
        { id: 'management', label: 'Management', icon: <PeopleAlt /> },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isCollapsed ? collapsedWidth : drawerWidth,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                '& .MuiDrawer-paper': {
                    width: isCollapsed ? collapsedWidth : drawerWidth,
                    transition: (theme) => theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                    background: '#ffffff',
                    borderRight: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
                    zIndex: 1000,
                    position: 'relative' // because we will place it inside a flex container
                },
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: isCollapsed ? 'center' : 'flex-end', 
                    p: 2,
                    minHeight: 64 // to match AppBar height approximately
                }}
            >
                <IconButton onClick={handleToggle} sx={{ color: '#0F4C5C' }}>
                    {isCollapsed ? <MenuIcon /> : <ChevronLeft />}
                </IconButton>
            </Box>
            <Divider />
            <List sx={{ mt: 2, px: 2 }}>
                {menuItems.map((item) => (
                    <Tooltip 
                        key={item.id} 
                        title={isCollapsed ? item.label : ''} 
                        placement="right"
                        arrow
                    >
                        <ListItem disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => setActiveView(item.id)}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: isCollapsed ? 'center' : 'initial',
                                    px: 2.5,
                                    borderRadius: 2,
                                    bgcolor: activeView === item.id ? 'rgba(15, 76, 92, 0.08)' : 'transparent',
                                    color: activeView === item.id ? '#0F4C5C' : '#6b7280',
                                    '&:hover': {
                                        bgcolor: activeView === item.id ? 'rgba(15, 76, 92, 0.12)' : 'rgba(0,0,0,0.04)',
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: isCollapsed ? 0 : 2,
                                        justifyContent: 'center',
                                        color: activeView === item.id ? '#0F4C5C' : '#9ca3af',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                {!isCollapsed && (
                                    <ListItemText 
                                        primary={item.label} 
                                        primaryTypographyProps={{ 
                                            fontWeight: activeView === item.id ? 600 : 500 
                                        }} 
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Drawer>
    );
};

export default AdminSidebar;
