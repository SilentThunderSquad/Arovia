import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, FileText, Activity } from 'lucide-react';

const AdminAnalytics = ({ analytics }) => {
    // Default data if analytics is loading/empty
    const registrationData = analytics?.registrationTrend?.map(d => ({
        date: d._id,
        users: d.count
    })) || [];

    const roleData = [
        { name: 'Users', value: analytics?.usersByRole?.user || 0, color: '#3b82f6' },
        { name: 'Admins', value: analytics?.usersByRole?.admin || 0, color: '#8b5cf6' },
        { name: 'Doctors', value: analytics?.usersByRole?.doctor || 0, color: '#10b981' },
    ].filter(d => d.value > 0);

    return (
        <div className="analytics-container">
            {/* KPI Cards */}
            <div className="grid-container grid-3">
                <div className="card kpi-card">
                    <div className="kpi-icon blue"><Users size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Users</h3>
                        <p className="kpi-value">{analytics?.totalUsers || 0}</p>
                    </div>
                </div>
                <div className="card kpi-card">
                    <div className="kpi-icon green"><FileText size={24} /></div>
                    <div className="kpi-info">
                        <h3>Prescriptions</h3>
                        {/* Assuming we don't have total prescriptions count yet in analytics response, placeholder */}
                        <p className="kpi-value">--</p>
                    </div>
                </div>
                <div className="card kpi-card">
                    <div className="kpi-icon purple"><Activity size={24} /></div>
                    <div className="kpi-info">
                        <h3>Active Today</h3>
                        <p className="kpi-value">--</p>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid-container grid-2 charts-row">
                <div className="card chart-card">
                    <h3>User Registrations (Last 7 Days)</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={registrationData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>User Distribution</h3>
                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
