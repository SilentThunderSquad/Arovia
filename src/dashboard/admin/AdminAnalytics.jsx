import { motion } from 'framer-motion';
import { Box, Grid, Card, CardContent, Typography, Paper } from '@mui/material';
import { People, Description, TrendingUp } from '@mui/icons-material';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

const AdminAnalytics = ({ analytics }) => {
    const registrationData =
        analytics?.registrationTrend?.map((d) => ({
            date: d._id,
            users: d.count,
        })) || [];

    const roleData = [
        { name: 'Users', value: analytics?.usersByRole?.user || 0, color: '#0F4C5C' },
        { name: 'Admins', value: analytics?.usersByRole?.admin || 0, color: '#2EC4B6' },
        { name: 'Doctors', value: analytics?.usersByRole?.doctor || 0, color: '#FFB703' },
    ].filter((d) => d.value > 0);

    const kpiCards = [
        {
            title: 'Total Users',
            value: analytics?.totalUsers || 0,
            icon: People,
            color: '#0F4C5C',
            gradient: 'linear-gradient(135deg, #0F4C5C 0%, #1a6b7f 100%)',
        },
        {
            title: 'Prescriptions',
            value: '--',
            icon: Description,
            color: '#2EC4B6',
            gradient: 'linear-gradient(135deg, #2EC4B6 0%, #4dd4c7 100%)',
        },
        {
            title: 'Active Today',
            value: '--',
            icon: TrendingUp,
            color: '#FFB703',
            gradient: 'linear-gradient(135deg, #FFB703 0%, #ffc733 100%)',
        },
    ];

    return (
        <Box>
            {/* KPI Cards */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
                {kpiCards.map((kpi, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                                y: -8,
                                boxShadow: `0 20px 40px ${kpi.color}30`,
                            }}
                            sx={{
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                position: 'relative',
                                overflow: 'hidden',
                                minHeight: 140,
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    width: '150px',
                                    height: '150px',
                                    background: kpi.gradient,
                                    opacity: 0.1,
                                    borderRadius: '50%',
                                    transform: 'translate(30%, -30%)',
                                }}
                            />
                            <CardContent sx={{ position: 'relative', zIndex: 1, py: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            background: kpi.gradient,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                        }}
                                    >
                                        <kpi.icon sx={{ fontSize: 32, color: 'white' }} />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>
                                            {kpi.title}
                                        </Typography>
                                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827' }}>
                                            {kpi.value}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={4}>
                <Grid item xs={12} lg={6}>
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        sx={{
                            p: 4,
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            minHeight: 450,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: '#0F4C5C' }}>
                            User Registrations (Last 7 Days)
                        </Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={registrationData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="date" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#e5e7eb',
                                        color: '#111827',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="users"
                                    stroke="#2EC4B6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorUsers)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid item xs={12} lg={6}>
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        sx={{
                            p: 4,
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            minHeight: 450,
                        }}
                    >
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 600, color: '#0F4C5C' }}>
                            User Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={130}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderColor: '#e5e7eb',
                                        color: '#111827',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminAnalytics;
