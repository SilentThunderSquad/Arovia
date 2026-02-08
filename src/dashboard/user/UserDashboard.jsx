import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, CircularProgress, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { Assessment, LocalPharmacy, LocationOn } from '@mui/icons-material';

import DashboardHeader from '../../dashboard/components/DashboardHeader';
import ProfilePanel from '../../dashboard/components/ProfilePanel';
import PasswordPanel from '../../dashboard/components/PasswordPanel';
import DeleteAccountPanel from '../../dashboard/components/DeleteAccountPanel';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Side Panel States
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserInfo(data);

            // First-Time User Flow: Open Edit Profile if key fields are missing
            if (!data.phone || !data.address?.city) {
                setIsProfileOpen(true);
                Swal.fire({
                    title: 'Welcome!',
                    text: 'Please complete your profile to continue.',
                    icon: 'info',
                    confirmButtonColor: '#0F4C5C'
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load user information',
                icon: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const formData = new FormData();

            // Append simple fields
            if (updatedData.name) formData.append('name', updatedData.name);
            if (updatedData.phone) formData.append('phone', updatedData.phone);
            if (updatedData.dob) formData.append('dob', updatedData.dob);
            if (updatedData.bloodDonation !== undefined) formData.append('bloodDonor', updatedData.bloodDonation);

            // Append Profile Picture if new one selected
            if (updatedData.avatarFile) {
                formData.append('profilePicture', updatedData.avatarFile);
            }

            // Append Address (Pack into object if needed by backend or send flattened)
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
                    // Content-Type header not set for FormData, browser sets it with boundary
                },
                body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update profile');
            }

            const data = await response.json();
            setUserInfo(data.user); // Update state with complete user object from server, including new image URL

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile details have been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error updating user data:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to update user information',
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            localStorage.clear();
            navigate('/login');
            Swal.fire('Account Deleted', 'Your account and data have been permanently removed.', 'success');

        } catch (error) {
            console.error('Error deleting account:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to delete account. Please try again.',
                icon: 'error'
            });
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
                <CircularProgress size={60} sx={{ color: '#0F4C5C' }} />
            </Box>
        );
    }

    // Dashboard Widgets (Summary Cards)
    const StatCard = ({ icon, title, value, color }) => (
        <Card component={motion.div} whileHover={{ y: -5 }} elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: '50%', bgcolor: `${color}20`, color: color }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                    <Typography variant="h5" fontWeight="bold">{value}</Typography>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ minHeight: '100vh', background: '#F4F6F8' }}>
            {/* Header with Avatar Menu */}
            <DashboardHeader
                user={userInfo}
                onEditProfile={() => setIsProfileOpen(true)}
                onChangePassword={() => setIsPasswordOpen(true)}
                onLogout={handleLogout}
                onDeleteAccount={() => setIsDeleteOpen(true)}
            />

            {/* Main Content Area */}
            <Container maxWidth={false} disableGutters sx={{ py: 4, px: 0, width: '100%' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    {/* Content removed per user request */}
                </motion.div>
            </Container>

            {/* Side Panels */}
            <ProfilePanel
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={userInfo}
                onSave={handleUpdateUser}
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

export default UserDashboard;
