import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Box, Chip, CircularProgress, Container, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import { ArrowBack, Bloodtype, Cake, Email, LocationOn, Person, Phone } from '@mui/icons-material';

import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import DeleteAccountPanel from '@shared/components/feedback/DeleteAccountPanel';
import PasswordPanel from '@shared/components/feedback/PasswordPanel';
import ProfilePanel from '@shared/components/forms/ProfilePanel';
import DashboardHeader from '@shared/components/layout/DashboardHeader';

import userService from '@features/user/services/userService';

import { useAuth } from '@shared/hooks/useAuth';

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { username } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape' && !isEditOpen && !isPasswordOpen && !isDeleteOpen) {
                navigate('/dashboard/user');
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [navigate, isEditOpen, isPasswordOpen, isDeleteOpen]);

    useEffect(() => { fetchUserData(); }, [username]);

    const fetchUserData = async () => {
        try {
            if (!localStorage.getItem('token')) { navigate('/'); return; }
            const data = await userService.getProfile();
            setUserInfo(data);
        } catch (error) {
            if (error.message?.includes('401')) { await logout(); navigate('/'); return; }
            Swal.fire('Error', 'Failed to load profile', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (updatedData) => {
        try {
            const formData = new FormData();
            if (updatedData.name) formData.append('name', updatedData.name);
            if (updatedData.phone) formData.append('phone', updatedData.phone);
            if (updatedData.dob) formData.append('dob', updatedData.dob);
            if (updatedData.gender) formData.append('gender', updatedData.gender);
            if (updatedData.bloodDonation !== undefined) formData.append('bloodDonor', updatedData.bloodDonation);
            if (updatedData.avatarFile) formData.append('profilePicture', updatedData.avatarFile);
            formData.append('address', JSON.stringify({
                country: updatedData.country, state: updatedData.state,
                city: updatedData.city, pincode: updatedData.pincode,
                addressLine1: updatedData.address1, addressLine2: updatedData.address2,
            }));
            const data = await userService.updateProfile(formData);
            setUserInfo(data.user);
            Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 2000, showConfirmButton: false });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const handleDeleteAccount = async () => {
        try {
            await userService.deleteAccount();
            await logout();
            navigate('/');
            Swal.fire('Account Deleted', 'Your account has been removed.', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to delete account.', 'error');
        }
    };

    if (loading) return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress sx={{ color: '#0F4C5C' }} />
        </Box>
    );

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <DashboardHeader user={userInfo} onEditProfile={() => setIsEditOpen(true)} onChangePassword={() => setIsPasswordOpen(true)} onLogout={handleLogout} onDeleteAccount={() => setIsDeleteOpen(true)} />

            <Container maxWidth={false} sx={{ py: { xs: 4, xl: 6 }, px: { xs: 3, md: 6, lg: 8, xl: 12 }, maxWidth: '1600px' }}>
                <Box sx={{ mb: 4 }}>
                    <IconButton onClick={() => navigate('/dashboard/user')} sx={{ color: '#0F4C5C', p: 0, '&:hover': { bgcolor: 'transparent', transform: 'translateX(-4px)' }, transition: 'all 0.2s ease-in-out' }}>
                        <ArrowBack sx={{ fontSize: { xs: 28, xl: 32 } }} />
                    </IconButton>
                </Box>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Grid container spacing={{ xs: 4, md: 6, xl: 8 }}>
                        <Grid xs={12} md={4} lg={3} sx={{ borderRight: { md: '2px solid rgba(0,0,0,0.1)' }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', pr: { md: 4, xl: 6 }, mb: { xs: 4, md: 0 } }}>
                            <Avatar
                                src={userInfo?.profilePicture ? (userInfo.profilePicture.startsWith('http') ? userInfo.profilePicture : `${window.location.origin}${userInfo.profilePicture}`) : ''}
                                sx={{ width: { xs: 180, md: 200, xl: 240 }, height: { xs: 180, md: 200, xl: 240 }, bgcolor: '#2b2b2b', fontSize: { xs: '3.5rem', md: '4rem', xl: '5rem' }, mb: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
                            >
                                {userInfo?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, mb: 2, fontSize: { xs: '1.1rem', xl: '1.25rem' } }}>
                                @{username || userInfo?.name?.toLowerCase().replace(/\s/g, '')}
                            </Typography>
                            {userInfo?.bloodDonor && (
                                <Chip icon={<Bloodtype sx={{ fontSize: 20, color: '#fff !important' }} />} label="Blood Donor" sx={{ fontWeight: 'bold', bgcolor: '#d32f2f', color: 'white', fontSize: '0.875rem', px: 1.5, py: 2, borderRadius: '50px' }} />
                            )}
                        </Grid>

                        <Grid xs={12} md={8} lg={9} sx={{ pl: { md: 6, lg: 8, xl: 10 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-start' }}>
                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#0F4C5C', mb: 1.5, fontSize: { xs: '2.25rem', md: '2.75rem', xl: '3.5rem' } }}>
                                    {userInfo?.name}
                                </Typography>
                                <Divider sx={{ mb: 4, borderColor: 'rgba(0,0,0,0.1)' }} />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 4, xl: 6 } }}>
                                        {userInfo?.email && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Email sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                                <Typography variant="h5" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>{userInfo.email}</Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Phone sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                            <Typography variant="h5" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>{userInfo?.phone || 'N/A'}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Cake sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                            <Typography variant="h5" fontWeight="500" color="text.primary" sx={{ fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>{userInfo?.dob ? new Date(userInfo.dob).toLocaleDateString() : 'N/A'}</Typography>
                                        </Box>
                                        {userInfo?.gender && (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Person sx={{ color: '#0F4C5C', fontSize: { xs: 24, xl: 28 } }} />
                                                <Typography variant="h5" fontWeight="500" color="text.primary" sx={{ textTransform: 'capitalize', fontSize: { xs: '1.1rem', xl: '1.3rem' } }}>{userInfo.gender}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                                        <LocationOn sx={{ color: '#0F4C5C', mt: 0.5, fontSize: { xs: 28, xl: 32 } }} />
                                        <Typography variant="h5" fontWeight="400" color="text.secondary" sx={{ lineHeight: 1.5, maxWidth: '1000px', fontSize: { xs: '1.1rem', xl: '1.25rem' } }}>
                                            {userInfo?.address?.addressLine1 ? (
                                                <>
                                                    {userInfo.address.addressLine1}
                                                    {userInfo.address.addressLine2 && `, ${userInfo.address.addressLine2}`}
                                                    <br />{userInfo.address.city}, {userInfo.address.state} — {userInfo.address.pincode}
                                                    <br />{userInfo.address.country}
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

            <ProfilePanel isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={userInfo} onSave={handleUpdateUser} />
            <PasswordPanel isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
            <DeleteAccountPanel isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onDeleteConfirm={handleDeleteAccount} />
        </Box>
    );
};

export default UserProfilePage;

