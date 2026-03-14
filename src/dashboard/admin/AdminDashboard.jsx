import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import AdminAnalytics from './AdminAnalytics';
import UserManagementTable from './UserManagementTable';

import AdminDashboardHeader from './AdminDashboardHeader';
import ProfilePanel from '../components/ProfilePanel';
import PasswordPanel from '../components/PasswordPanel';
import DeleteAccountPanel from '../components/DeleteAccountPanel';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Admin Info
    const [userInfo, setUserInfo] = useState(null);

    // Side Panel States
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchAdminData();
        fetchAdminProfile();
    }, []);

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
                setUserInfo(data);
            }
        } catch (error) {
            console.error('Failed to fetch admin profile:', error);
        }
    };

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
                headers: { Authorization: `Bearer ${token}` },
            });

            if (analyticsResponse.status === 403) {
                throw new Error('Access Denied');
            }

            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);

            // Fetch Users
            const usersResponse = await fetch(`${apiUrl}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
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
                    background: '#ffffff',
                    color: '#111827',
                }).then(() => {
                    localStorage.removeItem('token');
                    navigate('/login');
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to load dashboard data',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateAdmin = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const formData = new FormData();
            if (updatedData.name) formData.append('name', updatedData.name);
            if (updatedData.phone) formData.append('phone', updatedData.phone);
            if (updatedData.dob) formData.append('dob', updatedData.dob);
            if (updatedData.bloodDonation !== undefined) formData.append('bloodDonor', updatedData.bloodDonation);
            if (updatedData.avatarFile) formData.append('profilePicture', updatedData.avatarFile);

            const addressObj = {
                country: updatedData.country,
                state: updatedData.state,
                city: updatedData.city,
                pincode: updatedData.pincode,
                addressLine1: updatedData.address1,
                addressLine2: updatedData.address2
            };
            formData.append('address', JSON.stringify(addressObj));

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update profile');
            }

            const data = await response.json();
            setUserInfo(data.user);

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Admin profile details have been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error updating admin data:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to update admin information',
                icon: 'error'
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/delete-account`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            localStorage.clear();
            navigate('/login');
            Swal.fire('Account Deleted', 'Your account has been removed.', 'success');
        } catch (error) {
            console.error('Error deleting account:', error);
            Swal.fire('Error', 'Failed to delete account.', 'error');
        }
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8F9FA',
                }}
            >
                <CircularProgress size={60} sx={{ color: '#0F4C5C' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: '#F4F6F8' }}>
            {/* Header matching UserDashboard structure */}
            <AdminDashboardHeader
                user={userInfo}
                onEditProfile={() => setIsProfileOpen(true)}
                onChangePassword={() => setIsPasswordOpen(true)}
                onLogout={handleLogout}
                onDeleteAccount={() => setIsDeleteOpen(true)}
            />

            {/* Main Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: '#0F4C5C' }}>
                        Overview
                    </Typography>
                    <AdminAnalytics analytics={analytics} />
                </Box>

                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    sx={{ mt: 4 }}
                >
                    <UserManagementTable users={users} onUserUpdate={fetchAdminData} />
                </Box>
            </Container>

            {/* Side Panels */}
            <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={userInfo}
                onSave={handleUpdateAdmin}
            />

            <PasswordPanel
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
            />

            <DeleteAccountPanel
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onDeleteConfirm={handleDeleteAccount}
            />
        </Box>
    );
};

export default AdminDashboard;
