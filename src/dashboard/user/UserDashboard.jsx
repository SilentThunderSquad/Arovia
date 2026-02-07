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
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Dashboard Overview
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your health profile and settings
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {/* Summary Cards */}
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<Assessment fontSize="large" />}
                                title="Health Profile"
                                value="85%"
                                color="#2EC4B6"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<LocalPharmacy fontSize="large" />}
                                title="Prescriptions"
                                value="3 Active"
                                color="#FFB703"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <StatCard
                                icon={<LocationOn fontSize="large" />}
                                title="Saved Address"
                                value={userInfo?.address?.city || 'Not Set'}
                                color="#E71D36"
                            />
                        </Grid>

                        {/* Recent Activity / Information */}
                        <Grid item xs={12} md={8}>
                            <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }} elevation={1}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Your Profile Summary
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Full Name</Typography>
                                        <Typography variant="body1">{userInfo?.name}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">{userInfo?.email}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Phone</Typography>
                                        <Typography variant="body1">{userInfo?.phone || 'Not provided'}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="text.secondary">Location</Typography>
                                        <Typography variant="body1">
                                            {userInfo?.address?.city ? `${userInfo.address.city}, ${userInfo.address.state}` : 'Not provided'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 2, height: '100%', bgcolor: '#0F4C5C', color: 'white' }} elevation={1}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Quick Action
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                                    Need to update your health records?
                                </Typography>
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    style={{
                                        background: 'white',
                                        color: '#0F4C5C',
                                        border: 'none',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    Update Profile
                                </button>
                            </Paper>
                        </Grid>
                    </Grid>
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
