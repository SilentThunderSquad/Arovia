import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState({
        totalUsers: 0,
        lastLoggedInUser: null,
        usersByRole: {}
    });
    const [allUsers, setAllUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' or 'users'

    useEffect(() => {
        fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

            // Fetch analytics
            const analyticsResponse = await fetch(`${apiUrl}/api/admin/analytics`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!analyticsResponse.ok) {
                throw new Error('Failed to fetch analytics');
            }

            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);

            // Fetch all users
            const usersResponse = await fetch(`${apiUrl}/api/admin/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }

            const usersData = await usersResponse.json();
            setAllUsers(usersData.users || []);
        } catch (error) {
            console.error('Error fetching admin data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load admin data',
                icon: 'error',
                background: '#1a1a2e',
                color: '#fff'
            });
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
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => setActiveTab('analytics')}
                    >
                        Analytics
                    </button>
                    <button 
                        className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        All Users
                    </button>
                </div>

                {activeTab === 'analytics' && (
                    <div className="analytics-section">
                        <h2>System Analytics</h2>
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <div className="card-icon">👥</div>
                                <div className="card-content">
                                    <h3>Total Users</h3>
                                    <p className="card-value">{analytics.totalUsers}</p>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="card-icon">👤</div>
                                <div className="card-content">
                                    <h3>Regular Users</h3>
                                    <p className="card-value">{analytics.usersByRole?.user || 0}</p>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="card-icon">⚕️</div>
                                <div className="card-content">
                                    <h3>Doctors</h3>
                                    <p className="card-value">{analytics.usersByRole?.doctor || 0}</p>
                                </div>
                            </div>

                            <div className="analytics-card">
                                <div className="card-icon">🔐</div>
                                <div className="card-content">
                                    <h3>Admins</h3>
                                    <p className="card-value">{analytics.usersByRole?.admin || 0}</p>
                                </div>
                            </div>
                        </div>

                        {analytics.lastLoggedInUser && (
                            <div className="last-login-section">
                                <h3>Last User Activity</h3>
                                <div className="last-login-card">
                                    <div className="user-avatar">
                                        {analytics.lastLoggedInUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="user-details">
                                        <p className="user-name">{analytics.lastLoggedInUser.name}</p>
                                        <p className="user-email">{analytics.lastLoggedInUser.email}</p>
                                        <p className="user-role">Role: {analytics.lastLoggedInUser.role}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="users-section">
                        <h2>All Users ({allUsers.length})</h2>
                        <div className="users-table-container">
                            <table className="users-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Joined Date</th>
                                        <th>Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user) => (
                                        <tr key={user._id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar-small">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{user.name}</span>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
