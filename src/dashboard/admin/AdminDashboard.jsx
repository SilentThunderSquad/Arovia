import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Box,
    Container,
    Typography,
    Button,
    AppBar,
    Toolbar,
    CircularProgress,
} from '@mui/material';
import {
    Logout,
    Dashboard as DashboardIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import AdminAnalytics from './AdminAnalytics';
import UserManagementTable from './UserManagementTable';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            // Fetch Analytics
            const analyticsResponse = await fetch(`${apiUrl}/api/admin/analytics`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (analyticsResponse.status === 403) {
                throw new Error('Access Denied');
            }

            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);

            // Fetch Users
            const usersResponse = await fetch(`${apiUrl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const usersData = await usersResponse.json();
            setUsers(usersData.users || []);
        } catch (error) {
            console.error('Error:', error);
            if (error.message === 'Access Denied') {
                Swal.fire({
                    title: 'Access Denied',
                    text: 'You do not have permission to view this page.',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                }).then(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load dashboard data',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
            }
        } finally {
            setIsLoading(false);
        }
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
                        Loading admin dashboard...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: '#F8F9FA',
                position: 'relative',
            }}
        >
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
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{ mr: 2, color: 'rgba(255,255,255,0.9)' }}>
                        Administrator
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
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#0F4C5C' }}>
                        Overview
                    </Typography>
                    <AdminAnalytics analytics={analytics} />
                </Box>

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    sx={{ mt: 4 }}
                >
                    <UserManagementTable users={users} onUserUpdate={fetchAdminData} />
                </Box>
            </Container>
        </Box>
    );
};

export default AdminDashboard;
