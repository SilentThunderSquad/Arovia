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
    PieChart, Pie, Cell, 
    Tooltip, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis,
    BarChart, Bar
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
                    <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary, letterSpacing: '-0.02em' }}>
                        Dashboard Intelligence
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        Platform status and analytics derived from real-time database records.
                    </Typography>
                </Box>
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: '8px 20px', 
                        borderRadius: 10, 
                        bgcolor: '#fff', 
                        border: '1px solid', 
                        borderColor: alpha(colors.primary, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: colors.success, animation: 'pulse 2s infinite' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: colors.primary }}>
                        System Status: Operational
                    </Typography>
                </Paper>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statSummary.map((stat, idx) => (
                    <Grid item xs={12} sm={6} lg={3} key={idx} component={motion.div} variants={itemVariants}>
                        <Card 
                            sx={{ 
                                borderRadius: 4, 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', 
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                background: '#fff',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                                    <Avatar 
                                        sx={{ 
                                            bgcolor: alpha(stat.color, 0.1), 
                                            color: stat.color,
                                            width: 56,
                                            height: 56,
                                            borderRadius: 3
                                        }}
                                    >
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', mt: 0.5, fontSize: '0.75rem' }}>
                                            {stat.name}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 1.5, borderColor: alpha(stat.color, 0.1) }} />
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                                    {stat.desc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts and Lists Grid */}
            <Grid container spacing={3}>
                {/* Registration Trend Chart */}
                <Grid item xs={12} lg={8} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary }}>
                                        Registration Growth
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Daily new accounts over the last 7 days
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ height: 450, width: '100%', mt: 2 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    {activityData.length > 0 ? (
                                        <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: '#64748b', fontSize: 13, fontWeight: 700}} 
                                                dy={15}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: '#64748b', fontSize: 13, fontWeight: 700}} 
                                                allowDecimals={false}
                                                dx={-10}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    borderRadius: 16, 
                                                    border: 'none', 
                                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)', 
                                                    padding: '16px',
                                                    backgroundColor: '#fff'
                                                }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="signups" 
                                                stroke={colors.primary} 
                                                strokeWidth={5} 
                                                fillOpacity={1} 
                                                fill="url(#colorSignups)" 
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    ) : (
                                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="body1" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                Insufficient data for trend visualization
                                            </Typography>
                                        </Box>
                                    )}
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Role Composition Pie */}
                <Grid item xs={12} lg={4} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary, mb: 4 }}>
                                Database Composition
                            </Typography>
                            <Box sx={{ height: 320, position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={roleData}
                                            innerRadius={85}
                                            outerRadius={110}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {roleData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <Typography variant="h3" sx={{ fontWeight: 900, color: colors.primary, lineHeight: 1 }}>
                                        {totalCount}
                                    </Typography>
                                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: '0.1em' }}>
                                        TOTAL
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {roleData.map((role, idx) => (
                                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Box sx={{ width: 14, height: 14, borderRadius: '4px', bgcolor: role.color }} />
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>{role.name}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 800, color: colors.primary }}>
                                            {totalCount > 0 ? ((role.value / totalCount) * 100).toFixed(1) : 0}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Doctor Specializations Chart */}
                <Grid item xs={12} lg={6} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary, mb: 4 }}>
                                Top Medical Specializations
                            </Typography>
                            <Box sx={{ height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    {specData.length > 0 ? (
                                        <BarChart data={specData} layout="vertical" margin={{ left: 20, right: 30 }}>
                                            <XAxis type="number" hide />
                                            <YAxis 
                                                dataKey="name" 
                                                type="category" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{fill: '#475569', fontWeight: 700, fontSize: 13}} 
                                                width={100}
                                            />
                                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: 12}} />
                                            <Bar dataKey="value" fill={colors.secondary} radius={[0, 10, 10, 0]} barSize={25} />
                                        </BarChart>
                                    ) : (
                                        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="body2" sx={{ color: 'text.disabled' }}>No doctor data available</Typography>
                                        </Box>
                                    )}
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Platform Activity */}
                <Grid item xs={12} lg={6} component={motion.div} variants={itemVariants}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid', borderColor: alpha(colors.primary, 0.05) }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary }}>
                                    Latest Registrations
                                </Typography>
                                <Chip label="Live Feed" size="small" sx={{ fontWeight: 700, bgcolor: alpha(colors.success, 0.1), color: colors.success }} />
                            </Box>
                            <List sx={{ p: 0 }}>
                                {realRecentActivities.length > 0 ? realRecentActivities.map((activity, idx) => (
                                    <React.Fragment key={idx}>
                                        <ListItem sx={{ px: 0, py: 2 }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ 
                                                    bgcolor: alpha(activity.color, 0.1), 
                                                    color: activity.color,
                                                    borderRadius: 2.5
                                                }}>
                                                    {activity.icon}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText 
                                                primary={<Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b' }}>{activity.user}</Typography>}
                                                secondary={
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                        New {activity.role} registration
                                                    </Typography>
                                                }
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, display: 'block' }}>
                                                    {activity.time}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: activity.role === 'Doctor' ? colors.secondary : colors.warning, fontWeight: 800, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                                    {activity.role}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                        {idx < realRecentActivities.length - 1 && <Divider component="li" sx={{ borderStyle: 'dashed' }} />}
                                    </React.Fragment>
                                )) : (
                                    <Box sx={{ py: 4, textAlign: 'center' }}>
                                        <Typography variant="body2" sx={{ color: 'text.disabled' }}>No recent registrations found</Typography>
                                    </Box>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            
            {/* Pulsing animation styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
            `}} />
        </Box>
    );
};

export default AdminOverview;
