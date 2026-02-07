import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AvatarMenu from './AvatarMenu';

const DashboardHeader = ({ user, onEditProfile, onChangePassword, onLogout, onDeleteAccount }) => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: 'rgba(255, 255, 255, 0.8)', // Glassmorphism header base
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                color: '#333'
            }}
        >
            <Toolbar>
                <DashboardIcon sx={{ mr: 2, fontSize: 32, color: '#0F4C5C' }} />

                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#0F4C5C' }}>
                        Arovia Health
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back, {user?.name?.split(' ')[0]}
                    </Typography>
                </Box>

                <AvatarMenu
                    user={user}
                    onEditProfile={onEditProfile}
                    onChangePassword={onChangePassword}
                    onLogout={onLogout}
                    onDeleteAccount={onDeleteAccount}
                />
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;
