import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LogOut, LayoutDashboard } from 'lucide-react';
import AdminAnalytics from './AdminAnalytics';
import UserManagementTable from './UserManagementTable';
import './AdminDashboard.css';

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
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (analyticsResponse.status === 403) {
                throw new Error('Access Denied');
            }

            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);

            // Fetch Users
            const usersResponse = await fetch(`${apiUrl}/api/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
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
                    background: '#1a1a2e',
                    color: '#fff'
                }).then(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load dashboard data',
                    icon: 'error',
                    background: '#1a1a2e',
                    color: '#fff'
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
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-container">
            <header className="dashboard-header glass-header">
                <div className="header-content">
                    <div className="logo-area">
                        <LayoutDashboard size={28} className="logo-icon" />
                        <h1>Admin Dashboard</h1>
                    </div>
                    <div className="user-actions">
                        <span className="welcome-text">Administrator</span>
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Overview</h2>
                    <AdminAnalytics analytics={analytics} />
                </div>

                <div className="dashboard-section user-management-section">
                    <UserManagementTable users={users} onUserUpdate={fetchAdminData} />
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
