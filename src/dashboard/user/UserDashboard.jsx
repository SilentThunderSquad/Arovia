import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    CircularProgress,
    Grid,
} from '@mui/material';
import { Logout, Dashboard as DashboardIcon } from '@mui/icons-material';
import Swal from 'sweetalert2';
import UserProfileOptions from './UserProfileOptions';
import AddressManager from './AddressManager';
import PrescriptionVault from './PrescriptionVault';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load user information',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = (updatedData) => {
        setUserInfo((prev) => ({ ...prev, ...updatedData }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={60} sx={{ color: '#FFB703', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#ffffff' }}>
                        Loading your dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: '#F8F9FA' }}>
            {/* Header */}
            <AppBar
                position="sticky"
                elevation={2}
                sx={{
                    background: 'linear-gradient(135deg, #0F4C5C 0%, #1a6b7f 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <Toolbar>
                    <DashboardIcon sx={{ mr: 2, fontSize: 32, color: '#FFB703' }} />
                    <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700, color: '#ffffff' }}>
                        User Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2, color: 'rgba(255,255,255,0.9)' }}>
                        Welcome, {userInfo?.name?.split(' ')[0]}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<Logout />}
                        onClick={handleLogout}
                        sx={{
                            borderColor: 'rgba(255,255,255,0.5)',
                            color: 'white',
                            borderWidth: '2px',
                            '&:hover': {
                                borderColor: '#FFB703',
                                backgroundColor: 'rgba(255,183,3,0.1)',
                                borderWidth: '2px',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Grid container spacing={3}>
                    {/* Profile and Address Row */}
                    <Grid item xs={12} md={6}>
                        <UserProfileOptions userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AddressManager userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </Grid>

                    {/* Prescription Vault */}
                    <Grid item xs={12}>
                        <PrescriptionVault userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </Grid>

                    {/* Security Settings */}
                    <Grid item xs={12}>
                        <SecuritySettings userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </Grid>

                    {/* Danger Zone */}
                    <Grid item xs={12}>
                        <DangerZone />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default UserDashboard;
