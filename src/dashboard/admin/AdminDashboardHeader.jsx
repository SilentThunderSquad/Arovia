import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminAvatarMenu from './AdminAvatarMenu';
import SessionTimer from '../components/SessionTimer';

const AdminDashboardHeader = ({ user, onEditProfile, onChangePassword, onLogout, onDeleteAccount }) => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                background: '#0f4c5c',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#fff'
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                {/* Left Side: Logo & Icon */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 2, fontSize: 32, color: '#FFB703' }} /> {/* Accent color for icon */}
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>
                        Arovia Admin Dashboard
                    </Typography>
                </Box>

                {/* Right Side: Session Timer, Greeting, Avatar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SessionTimer onSessionExpire={onLogout} />

                    <AdminAvatarMenu
                        user={user}
                        onEditProfile={onEditProfile}
                        onChangePassword={onChangePassword}
                        onLogout={onLogout}
                        onDeleteAccount={onDeleteAccount}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AdminDashboardHeader;
