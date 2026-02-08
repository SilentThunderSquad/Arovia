import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Grid, Paper, Avatar,
    CircularProgress, Divider, Chip, IconButton
} from '@mui/material';
import {
    Email, Phone, Cake, LocationOn,
    Bloodtype, Person, ArrowBack
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import DashboardHeader from '../../dashboard/components/DashboardHeader';
import ProfilePanel from '../../dashboard/components/ProfilePanel';
import PasswordPanel from '../../dashboard/components/PasswordPanel';
import DeleteAccountPanel from '../../dashboard/components/DeleteAccountPanel';

const UserProfilePage = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, [username]);

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
            Swal.fire('Error', 'Failed to load profile', 'error');
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

            if (updatedData.name) formData.append('name', updatedData.name);
            if (updatedData.phone) formData.append('phone', updatedData.phone);
            if (updatedData.dob) formData.append('dob', updatedData.dob);
            if (updatedData.gender) formData.append('gender', updatedData.gender);
            if (updatedData.bloodDonation !== undefined) formData.append('bloodDonor', updatedData.bloodDonation);

            if (updatedData.avatarFile) {
                formData.append('profilePicture', updatedData.avatarFile);
            }

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
                text: 'Your profile details have been updated successfully.',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error updating user data:', error);
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
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

            if (!response.ok) throw new Error('Failed to delete account');

            localStorage.clear();
            navigate('/login');
            Swal.fire('Account Deleted', 'Your account has been removed.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to delete account.', 'error');
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress sx={{ color: '#0F4C5C' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <DashboardHeader
                user={userInfo}
                onEditProfile={() => setIsProfileOpen(true)}
                onChangePassword={() => setIsPasswordOpen(true)}
                onLogout={handleLogout}
                onDeleteAccount={() => setIsDeleteOpen(true)}
            />

            <Container maxWidth="xl" sx={{ py: 6, px: { xs: 4, md: 8, lg: 12 } }}>
                <Box sx={{ mb: 4 }}>
                    <IconButton
                        onClick={() => navigate('/dashboard/user')}
                        sx={{
                            color: '#0F4C5C',
                            p: 0,
                            '&:hover': {
                                bgcolor: 'transparent',
                                transform: 'translateX(-4px)'
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <ArrowBack sx={{ fontSize: 32 }} />
                    </IconButton>
                </Box>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Grid container spacing={0}>
                        {/* LEFT: Profile Photo (Simple user identity) */}
                        <Grid item xs={12} md={4} lg={3} sx={{
                            borderRight: { md: '2px solid rgba(0,0,0,0.1)' },
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            pr: { md: 4 },
                            mb: { xs: 4, md: 0 }
                        }}>
                            <Avatar
                                src={userInfo?.profilePicture ? (userInfo.profilePicture.startsWith('http') ? userInfo.profilePicture : `${window.location.origin}${userInfo.profilePicture}`) : ''}
                                sx={{
                                    width: 200,
                                    height: 200,
                                    bgcolor: '#2b2b2b',
                                    fontSize: '4rem',
                                    mb: 2,
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                                }}
                            >
                                {userInfo?.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
                                @{username || userInfo?.name?.toLowerCase().replace(/\s/g, '')}
                            </Typography>

                            {userInfo?.bloodDonor && (
                                <Chip
                                    icon={<Bloodtype sx={{ fontSize: 24, color: '#fff !important' }} />}
                                    label="Blood Donor"
                                    sx={{
                                        fontWeight: 'bold',
                                        bgcolor: '#d32f2f',
                                        color: 'white',
                                        fontSize: '1rem',
                                        px: 2,
                                        py: 2.5,
                                        borderRadius: '50px'
                                    }}
                                />
                            )}
                        </Grid>

                        {/* RIGHT: Detailed Info */}
                        <Grid item xs={12} md={8} lg={9} sx={{ pl: { md: 6, lg: 8 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>

                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#0F4C5C', mb: 2 }}>
                                    {userInfo?.name}
                                </Typography>

                                <Divider sx={{ mb: 5, borderColor: 'rgba(0,0,0,0.1)' }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    {/* Info Row: Phone, DOB, Gender */}
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Phone sx={{ color: '#0F4C5C', fontSize: 28 }} />
                                            <Typography variant="h5" fontWeight="500" color="text.primary">
                                                {userInfo?.phone || 'N/A'}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Cake sx={{ color: '#0F4C5C', fontSize: 28 }} />
                                            <Typography variant="h5" fontWeight="500" color="text.primary">
                                                {userInfo?.dob ? new Date(userInfo.dob).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </Box>

                                        {userInfo?.gender && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Person sx={{ color: '#0F4C5C', fontSize: 28 }} />
                                                <Typography variant="h5" fontWeight="500" color="text.primary" sx={{ textTransform: 'capitalize' }}>
                                                    {userInfo.gender}
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Address Row */}
                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                                        <LocationOn sx={{ color: '#0F4C5C', mt: 0.5, fontSize: 32 }} />
                                        <Typography variant="h5" fontWeight="400" color="text.secondary" sx={{ lineHeight: 1.5, maxWidth: '800px' }}>
                                            {userInfo?.address ? (
                                                <>
                                                    {userInfo.address.addressLine1}
                                                    {userInfo.address.addressLine2 && `, ${userInfo.address.addressLine2}`}
                                                    <br />
                                                    {userInfo.address.city}, {userInfo.address.state} — {userInfo.address.pincode}
                                                    <br />
                                                    {userInfo.address.country}
                                                </>
                                            ) : 'No address provided'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </motion.div>
            </Container>

            {/* Hidden Panels for Menu Actions */}
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

export default UserProfilePage;
