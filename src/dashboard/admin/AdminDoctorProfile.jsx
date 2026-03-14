import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Avatar,
    CircularProgress, Divider, IconButton, Paper
} from '@mui/material';
import {
    ArrowBack, LocalHospital, Star, School,
    Phone, Language, LocationOn, AccessTime,
    Healing, AttachMoney, Business
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import AdminDashboardHeader from './AdminDashboardHeader';

const AdminDoctorProfile = () => {
    const navigate = useNavigate();
    const { doctorName } = useParams();
    const [doctorInfo, setDoctorInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Header context admin user data
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                navigate('/dashboard/admin');
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [navigate]);

    useEffect(() => {
        fetchAdminProfile();
        fetchDoctorData();
    }, [doctorName]);

    const fetchAdminProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;
            const response = await fetch(`${apiUrl}/api/user/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setAdminInfo(data);
            }
        } catch (error) {
            console.error('Failed to fetch admin profile:', error);
        }
    };

    const fetchDoctorData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            // Call the getDoctorByName route
            const response = await fetch(`${apiUrl}/api/admin/doctors/${encodeURIComponent(doctorName)}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    Swal.fire('Not Found', 'Doctor profile not found', 'warning').then(() => {
                        navigate('/dashboard/admin');
                    });
                    return;
                }
                throw new Error('Failed to fetch doctor data');
            }

            const data = await response.json();
            setDoctorInfo(data);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
            Swal.fire('Error', 'Failed to load doctor profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: '#0F4C5C' }} />
            </Box>
        );
    }

    if (!doctorInfo) return null;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <AdminDashboardHeader
                user={adminInfo}
                onEditProfile={() => navigate('/dashboard/admin/profile')}
                onChangePassword={() => {}}
                onLogout={handleLogout}
                onDeleteAccount={() => {}}
            />

            <Container maxWidth={false} sx={{ py: { xs: 4, xl: 6 }, px: { xs: 3, md: 6, lg: 8, xl: 12 }, maxWidth: '1600px' }}>
                <Box sx={{ mb: 4 }}>
                    <IconButton
                        onClick={() => navigate('/dashboard/admin')}
                        sx={{
                            color: '#0F4C5C',
                            p: 0,
                            '&:hover': {
                                bgcolor: 'transparent',
                                transform: 'translateX(-4px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <ArrowBack sx={{ fontSize: { xs: 28, xl: 32 } }} />
                    </IconButton>
                </Box>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Grid container spacing={{ xs: 4, md: 6, xl: 8 }}>
                        {/* LEFT: Profile Photo & Key Info */}
                        <Grid item xs={12} md={4} lg={3} sx={{
                            borderRight: { md: '2px solid rgba(0,0,0,0.1)' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            pr: { md: 4, xl: 6 },
                            mb: { xs: 4, md: 0 }
                        }}>
                            <Avatar
                                sx={{
                                    width: { xs: 180, md: 200, xl: 240 },
                                    height: { xs: 180, md: 200, xl: 240 },
                                    bgcolor: '#2EC4B6',
                                    fontSize: { xs: '3.5rem', md: '4rem', xl: '5rem' },
                                    mb: 3,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                }}
                            >
                                {doctorInfo.Name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography variant="h5" color="#0F4C5C" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.2rem', xl: '1.4rem' }, textAlign: 'center' }}>
                                {doctorInfo.Specialization}
                            </Typography>
                            
                            {doctorInfo.Sub_specialization && (
                                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, textAlign: 'center', fontWeight: 500 }}>
                                    {doctorInfo.Sub_specialization}
                                </Typography>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 3 }}>
                                {doctorInfo.Rating && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#fef3c7', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                        <Star sx={{ color: '#f59e0b', fontSize: 20 }} />
                                        <Typography variant="body1" fontWeight="bold" sx={{ color: '#b45309' }}>
                                            {doctorInfo.Rating}
                                        </Typography>
                                    </Box>
                                )}
                                {doctorInfo.Experience && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#e0f2fe', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                        <LocalHospital sx={{ color: '#0369a1', fontSize: 20 }} />
                                        <Typography variant="body1" fontWeight="bold" sx={{ color: '#0369a1' }}>
                                            {doctorInfo.Experience}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        {/* RIGHT: Detailed Info */}
                        <Grid item xs={12} md={8} lg={9} sx={{ pl: { md: 6, lg: 8, xl: 10 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>

                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#0F4C5C', mb: 1.5, fontSize: { xs: '2.25rem', md: '2.75rem', xl: '3.5rem' } }}>
                                    {doctorInfo.Name}
                                </Typography>

                                <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.1)' }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    
                                    {/* Education & Language Row */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 4, xl: 6 } }}>
                                        {doctorInfo.Qualification && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <School sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                                <Typography variant="h6" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>
                                                    {doctorInfo.Qualification}
                                                </Typography>
                                            </Box>
                                        )}
                                        {doctorInfo.Languages && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Language sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                                <Typography variant="h6" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>
                                                    {doctorInfo.Languages}
                                                </Typography>
                                            </Box>
                                        )}
                                        {doctorInfo.Contact && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Phone sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                                <Typography variant="h6" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>
                                                    {doctorInfo.Contact}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Hospital & Location */}
                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                                        <Business sx={{ color: '#0F4C5C', mt: 0.5, fontSize: { xs: 28, xl: 32 } }} />
                                        <Typography variant="h5" fontWeight="400" color="text.secondary" sx={{ lineHeight: 1.5, maxWidth: '1000px', fontSize: { xs: '1.1rem', xl: '1.25rem' } }}>
                                            <Typography component="span" fontWeight="600" color="text.primary" sx={{ fontSize: 'inherit' }}>
                                                {doctorInfo.Hospital}
                                            </Typography>
                                            <br />
                                            {doctorInfo.City && doctorInfo.State ? `${doctorInfo.City}, ${doctorInfo.State}` : (doctorInfo.City || doctorInfo.State || '')}
                                        </Typography>
                                    </Box>

                                    {/* Treatments */}
                                    {doctorInfo.Treats && (
                                        <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                                            <Healing sx={{ color: '#0F4C5C', mt: 0.5, fontSize: { xs: 28, xl: 32 } }} />
                                            <Box>
                                                <Typography variant="h6" fontWeight="600" color="text.primary" sx={{ mb: 1, fontSize: { xs: '1.1rem', xl: '1.25rem' } }}>
                                                    Treatments & Services
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: { xs: '1rem', xl: '1.15rem' } }}>
                                                    {doctorInfo.Treats}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Availability & Fees */}
                                    <Paper elevation={0} sx={{ p: 3, bgcolor: '#ffffff', borderRadius: 3, border: '1px solid #e5e7eb', mt: 2 }}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0369a1' }}>
                                                        <AccessTime />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                                                            Availability
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="600" color="#0F4C5C">
                                                            {doctorInfo.Schedule_days}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {doctorInfo.Consultation_time}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: '#dcfce7', color: '#15803d' }}>
                                                        <AttachMoney />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary" fontWeight="600" textTransform="uppercase" letterSpacing={1}>
                                                            Consultation Fee
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="600" color="#0F4C5C">
                                                            {doctorInfo.Consultation_fee}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>

                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>
        </Box>
    );
};

export default AdminDoctorProfile;
