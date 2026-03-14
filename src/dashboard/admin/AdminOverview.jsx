import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { 
    PieChart, Pie, Cell, 
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminOverview = ({ users, doctors }) => {
    // Analytics calculations
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;
    const doctorCount = doctors.length;

    const data = [
        { name: 'Admins', value: adminCount, color: '#0F4C5C' },
        { name: 'Users', value: userCount, color: '#FFB703' },
        { name: 'Doctors', value: doctorCount, color: '#2EC4B6' }
    ];

    return (
        <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 700, color: '#0F4C5C' }}>
                System Overview
            </Typography>

            <Grid container spacing={4}>
                {/* Pie Chart Card */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: '#fff', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#4b5563', mb: 2, fontWeight: 600 }}>
                                Role Distribution (Pie Chart)
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} 
                                        />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Bar Chart Card */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', background: '#fff', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: '#4b5563', mb: 2, fontWeight: 600 }}>
                                Role Counts (Bar Chart)
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data}
                                        margin={{
                                            top: 20, right: 30, left: 0, bottom: 5,
                                        }}
                                    >
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                        <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* Stats Cards Row */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {data.map((stat, idx) => (
                            <Grid item xs={12} sm={4} key={idx}>
                                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', borderLeft: `6px solid ${stat.color}` }}>
                                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                        <Typography variant="subtitle2" sx={{ color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                            Total {stat.name}
                                        </Typography>
                                        <Typography variant="h3" sx={{ color: '#111827', mt: 1, fontWeight: 700 }}>
                                            {stat.value}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminOverview;
