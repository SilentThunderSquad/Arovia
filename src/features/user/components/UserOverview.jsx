import { Avatar, Box, Button, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import { Bloodtype, CheckCircle, ChevronRight, Description, LocationOn } from '@mui/icons-material';

import { motion } from 'framer-motion';

const UserOverview = ({ userInfo, setActiveView }) => {
    // Calculate profile completion percentage
    const calculateCompletion = () => {
        let score = 0;
        let total = 6;
        if (userInfo?.name) score++;
        if (userInfo?.phone) score++;
        if (userInfo?.dob) score++;
        if (userInfo?.gender) score++;
        if (userInfo?.address?.addressLine1) score++;
        if (userInfo?.profilePicture) score++;
        return Math.round((score / total) * 100);
    };

    const completion = calculateCompletion();

    const statCards = [
        {
            title: 'Prescription Vault',
            value: `${userInfo?.prescriptions?.length || 0} Documents`,
            subtitle: 'Secure medical files',
            icon: <Description sx={{ fontSize: 40, color: '#0F4C5C' }} />,
            action: () => setActiveView('prescriptions'),
            actionLabel: 'Manage Files',
            bgcolor: 'rgba(15, 76, 92, 0.04)',
        },
        {
            title: 'Blood Donor Program',
            value: userInfo?.bloodDonor ? 'Active Donor' : 'Not Registered',
            subtitle: userInfo?.bloodDonor ? 'Ready to save lives ❤️' : 'Help in medical emergencies',
            icon: <Bloodtype sx={{ fontSize: 40, color: userInfo?.bloodDonor ? '#ef4444' : '#9ca3af' }} />,
            action: () => setActiveView('security'),
            actionLabel: userInfo?.bloodDonor ? 'Change Status' : 'Register Now',
            bgcolor: userInfo?.bloodDonor ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0, 0, 0, 0.02)',
        },
        {
            title: 'Primary Address',
            value: userInfo?.address?.city ? `${userInfo.address.city}, ${userInfo.address.state}` : 'Not Provided',
            subtitle: userInfo?.address?.pincode ? `Pincode: ${userInfo.address.pincode}` : 'Used for delivery',
            icon: <LocationOn sx={{ fontSize: 40, color: '#FFB703' }} />,
            action: () => setActiveView('address'),
            actionLabel: 'Update Address',
            bgcolor: 'rgba(255, 183, 3, 0.04)',
        }
    ];

    return (
        <Box sx={{ width: '100%' }}>
            {/* Welcoming Banner */}
            <Card 
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                sx={{ 
                    background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)',
                    color: '#ffffff',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(15, 76, 92, 0.15)',
                    mb: 4,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar
                                src={userInfo?.profilePicture}
                                sx={{ 
                                    width: { xs: 90, sm: 100 }, 
                                    height: { xs: 90, sm: 100 },
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    fontSize: '2.5rem',
                                    bgcolor: '#FFB703'
                                }}
                            >
                                {userInfo?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 7 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                Welcome back, {userInfo?.name || 'Healthy User'}!
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: '600px' }}>
                                Manage your medical documents, track blood donor status, and securely configure your clinical preferences.
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 600, textTransform: 'uppercase', tracking: 1.5 }}>
                                    Profile Completion
                                </Typography>
                                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{completion}%</Typography>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={completion} 
                                    sx={{ 
                                        height: 8, 
                                        borderRadius: 4, 
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& .MuiLinearProgress-bar': { bgcolor: '#FFB703' }
                                    }} 
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card, idx) => (
                    <Grid size={{ xs: 12, md: 4 }} key={idx}>
                        <Card 
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            sx={{ 
                                height: '100%', 
                                border: '1px solid #e5e7eb',
                                borderRadius: 2,
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                                    borderColor: '#2EC4B6'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: card.bgcolor }}>
                                        {card.icon}
                                    </Box>
                                    {completion === 100 && card.title === 'Primary Address' && (
                                        <CheckCircle sx={{ color: '#059669' }} />
                                    )}
                                </Box>
                                <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                    {card.title}
                                </Typography>
                                <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', my: 0.5 }}>
                                    {card.value}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                                    {card.subtitle}
                                </Typography>
                                <Box sx={{ mt: 'auto' }}>
                                    <Button 
                                        variant="text" 
                                        color="primary" 
                                        endIcon={<ChevronRight />} 
                                        onClick={card.action}
                                        sx={{ 
                                            p: 0, 
                                            fontWeight: 600, 
                                            color: '#0F4C5C',
                                            '&:hover': { color: '#2EC4B6', bgcolor: 'transparent' }
                                        }}
                                    >
                                        {card.actionLabel}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default UserOverview;
