import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AvatarMenu from '@shared/components/navigation/AvatarMenu';
import SessionTimer from './SessionTimer';

const DashboardHeader = ({ user, onEditProfile, onChangePassword, onLogout, onDeleteAccount }) => {
    const firstName = user?.name?.split(' ')[0] || 'User';

    return (
        <AppBar position="sticky" elevation={0} sx={{ background: '#0f4c5c', borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DashboardIcon sx={{ mr: 2, fontSize: 32, color: '#FFB703' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff' }}>Arovia</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SessionTimer onSessionExpire={onLogout} />
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>Welcome back, {firstName}</Typography>
                    <AvatarMenu user={user} onEditProfile={onEditProfile} onChangePassword={onChangePassword} onLogout={onLogout} onDeleteAccount={onDeleteAccount} />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;
