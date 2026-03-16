import React from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Grid, 
    Typography, 
    Avatar, 
    Chip, 
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Divider,
    Paper,
    useTheme,
    alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
    LineChart, Line,
    Tooltip, ResponsiveContainer,
    XAxis, YAxis,
    BarChart, Bar, Cell, CartesianGrid
} from 'recharts';
import {
    People as PeopleIcon,
    LocalHospital as DoctorIcon,
    SupervisorAccount as AdminIcon,
    TrendingUp as TrendingUpIcon,
    MoreVert as MoreVertIcon,
    CalendarToday as CalendarIcon,
    CheckCircle as CheckCircleIcon,
    ErrorOutline as ErrorIcon,
    TrendingDown as TrendingDownIcon
} from '@mui/icons-material';

const AdminOverview = ({ users = [], doctors = [], analytics = null }) => {
    const theme = useTheme();

    // Real Analytics calculations
    const adminCount = users?.filter(u => u.role === 'admin').length || 0;
    const userCount = users?.filter(u => u.role === 'user').length || 0;
    const doctorCount = doctors?.length || 0;
    const totalCount = adminCount + userCount + doctorCount;

    // Derived: Specialization Distribution (Real Data)
    const specMap = {};
    doctors.forEach(doc => {
        const spec = doc.Specialization || 'General';
        specMap[spec] = (specMap[spec] || 0) + 1;
    });
    const specData = Object.keys(specMap).map(key => ({ name: key, value: specMap[key] })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Derived: Real Registration Trend from Analytics
    const activityData = (analytics?.registrationTrend || []).map(item => ({
        date: new Date(item._id).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        signups: item.count
    }));

    // Derived: Real Recent Activities
    const allEntities = [
        ...users.map(u => ({ ...u, type: 'User', icon: <PeopleIcon /> })),
        ...doctors.map(d => ({ ...d, name: d.Name, type: 'Doctor', icon: <DoctorIcon /> }))
    ].sort((a, b) => {
        const dateA = new Date(a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
    });

    const realRecentActivities = allEntities.slice(0, 5).map((e, idx) => ({
        id: idx,
        user: e.name || e.Name || 'New Entity',
        role: e.type,
        time: e.createdAt ? new Date(e.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        icon: e.icon,
        color: e.type === 'Doctor' ? '#2EC4B6' : (e.role === 'admin' ? '#0F4C5C' : '#FFB703')
    }));

    // Colors
    const colors = {
        primary: '#0F4C5C',
        secondary: '#2EC4B6',
        warning: '#FFB703',
        info: '#457B9D',
        success: '#4CAF50',
        danger: '#E63946',
        bg: '#F8FAFC'
    };

    const statSummary = [
        { 
            name: 'Total Admins', 
            value: adminCount, 
            color: colors.primary, 
            icon: <AdminIcon />, 
            desc: 'System Administrators'
        },
        { 
            name: 'Patient Users', 
            value: userCount, 
            color: colors.warning, 
            icon: <PeopleIcon />, 
            desc: 'Registered Patients'
        },
        { 
            name: 'Doctors', 
            value: doctorCount, 
            color: colors.secondary, 
            icon: <DoctorIcon />, 
            desc: 'Medical Professionals'
        },
        { 
            name: 'Platform Growth', 
            value: totalCount, 
            color: colors.info, 
            icon: <TrendingUpIcon />, 
            desc: 'Total Active Accounts'
        }
    ];

    const roleData = [
        { name: 'Admins', value: adminCount, color: colors.primary },
        { name: 'Users', value: userCount, color: colors.warning },
        { name: 'Doctors', value: doctorCount, color: colors.secondary }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <Box 
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ p: { xs: 1, md: 3 }, backgroundColor: colors.bg, minHeight: '100%' }}
        >
            {/* Header Section */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: colors.primary, letterSpacing: '-0.02em' }}>
                        Platform Analytics
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
                        Key Performance Indicators and User Distribution
                    </Typography>
                </Box>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: '10px 24px', 
                        borderRadius: 10, 
                        bgcolor: '#fff', 
                        border: '2px solid', 
                        borderColor: alpha(colors.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: colors.success, animation: 'pulse 2s infinite' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: colors.primary }}>
                        LIVE METRICS
                    </Typography>
                </Paper>
            </Box>

            {/* KPI Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statSummary.map((stat, idx) => (
                    <Grid item xs={12} sm={6} lg={3} key={idx} component={motion.div} variants={itemVariants}>
                        <Card 
                            sx={{ 
                                borderRadius: 5, 
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', 
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: '#fff',
                                overflow: 'hidden',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2.5 }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: alpha(stat.color, 0.1), 
                                            color: stat.color,
                                            width: 64,
                                            height: 64,
                                            borderRadius: 4
                                        }}
                                    >
                                        {React.cloneElement(stat.icon, { sx: { fontSize: 32 } })}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ color: '#64748B', fontWeight: 800, textTransform: 'uppercase', mt: 0.5, letterSpacing: '0.05em' }}>
                                            {stat.name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2, borderColor: alpha(stat.color, 0.08) }} />
                                <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.8rem' }}>
                                    {stat.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Visual KPIs - Line and Bar Charts */}
            <Grid container spacing={3}>
                {/* Registration Trend Line Chart */}
                <Grid item xs={12} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 5, boxShadow: '0 4px 25px rgba(0,0,0,0.06)', height: '100%', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: colors.primary, mb: 3, textAlign: 'center' }}>
                                Registration Growth (Line)
                            </Typography>
                            <Box sx={{ height: 380 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    {activityData.length > 0 ? (
                                        <LineChart data={activityData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={alpha(colors.primary, 0.1)} />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: colors.primary, fontSize: 14, fontWeight: 800}} 
                                                dy={15}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: colors.primary, fontSize: 14, fontWeight: 800}} 
                                                allowDecimals={false}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    borderRadius: 16, 
                                                    border: 'none', 
                                                    boxShadow: '0 15px 30px rgba(0,0,0,0.1)', 
                                                    padding: '16px',
                                                    fontWeight: 800
                                                }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="signups" 
                                                stroke={colors.primary} 
                                                strokeWidth={6} 
                                                dot={{ r: 8, fill: colors.primary, strokeWidth: 3, stroke: '#fff' }}
                                                activeDot={{ r: 12, strokeWidth: 0 }}
                                                animationDuration={2500}
                                            />
                                        </LineChart>
                                    ) : (
                                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="h6" sx={{ color: 'text.disabled' }}>Insufficient trend data</Typography>
                                        </Box>
                                    )}
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Role Composition Bar Chart */}
                <Grid item xs={12} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 5, boxShadow: '0 4px 25px rgba(0,0,0,0.06)', height: '100%', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 5 }}>
                            <Typography variant="h5" sx={{ fontWeight: 900, color: colors.primary, mb: 3, textAlign: 'center' }}>
                                Account Composition (Bar)
                            </Typography>
                            <Box sx={{ height: 380 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roleData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={alpha(colors.primary, 0.1)} />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: colors.primary, fontSize: 16, fontWeight: 900}} 
                                            dy={15}
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: colors.primary, fontSize: 16, fontWeight: 900}} 
                                            allowDecimals={false}
                                        />
                                        <Tooltip 
                                            cursor={{fill: alpha(colors.primary, 0.03)}}
                                            contentStyle={{ 
                                                borderRadius: 16, 
                                                border: 'none', 
                                                boxShadow: '0 15px 30px rgba(0,0,0,0.1)', 
                                                padding: '16px',
                                                fontWeight: 800
                                            }}
                                        />
                                        <Bar 
                                            dataKey="value" 
                                            radius={[12, 12, 0, 0]} 
                                            barSize={80}
                                            animationDuration={2000}
                                        >
                                            {roleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15, 76, 92, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(15, 76, 92, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(15, 76, 92, 0); }
                }
            `}} />
        </Box>
    );
};

export default AdminOverview;
