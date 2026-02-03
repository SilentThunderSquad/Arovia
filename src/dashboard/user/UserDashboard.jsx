import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LogOut, LayoutDashboard } from 'lucide-react';
import UserProfileOptions from './UserProfileOptions';
import AddressManager from './AddressManager';
import PrescriptionVault from './PrescriptionVault';
import SecuritySettings from './SecuritySettings';
import DangerZone from './DangerZone';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle 401 specifically
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load user information',
                icon: 'error',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = (updatedData) => {
        setUserInfo(prev => ({ ...prev, ...updatedData }));
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
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="user-dashboard-container">
            <header className="dashboard-header glass-header">
                <div className="header-content">
                    <div className="logo-area">
                        <LayoutDashboard size={28} className="logo-icon" />
                        <h1>User Dashboard</h1>
                    </div>
                    <div className="user-actions">
                        <span className="welcome-text">Welcome, {userInfo?.name?.split(' ')[0]}</span>
                        <button onClick={handleLogout} className="btn btn-outline btn-sm">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="dashboard-grid">
                    {/* Top Row: Profile and Address */}
                    <div className="grid-section profile-section">
                        <UserProfileOptions userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </div>

                    <div className="grid-section address-section">
                        <AddressManager userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </div>

                    {/* Middle: Prescriptions */}
                    <div className="grid-section full-width vault-section">
                        <PrescriptionVault userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </div>

                    {/* Bottom: Security and Danger */}
                    <div className="grid-section full-width security-section">
                        <SecuritySettings userInfo={userInfo} onUpdate={handleUpdateUser} />
                    </div>

                    <div className="grid-section full-width danger-section">
                        <DangerZone />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
