import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Avatar,
    Box,
    Grid,
    IconButton,
} from '@mui/material';
import { Person, CameraAlt, Save } from '@mui/icons-material';
import Swal from 'sweetalert2';

const UserProfileOptions = ({ userInfo, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dob: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                phone: userInfo.phone || '',
                dob: userInfo.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '',
            });
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                Swal.fire({
                    title: 'Error',
                    text: 'Image size should be less than 2MB',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
                return;
            }
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedUser = await response.json();
            onUpdate(updatedUser.user || updatedUser);

            Swal.fire({
                title: 'Success',
                text: 'Profile updated successfully',
                icon: 'success',
                background: '#ffffff',
                color: '#111827',
                iconColor: '#2EC4B6',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update profile',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Person sx={{ mr: 1, color: '#0F4C5C', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>
                        Profile Information
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    {/* Profile Image */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={previewUrl}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: '#0F4C5C',
                                    fontSize: '3rem',
                                }}
                            >
                                {!previewUrl && userInfo?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <IconButton
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: '#FFB703',
                                    color: '#ffffff',
                                    '&:hover': { bgcolor: '#e6a500' },
                                    width: 36,
                                    height: 36,
                                }}
                            >
                                <CameraAlt sx={{ fontSize: 18 }} />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Form Fields */}
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                value={userInfo?.email || ''}
                                disabled
                                helperText="Email cannot be changed"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 9876543210"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                value={formData.dob}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                startIcon={<Save />}
                                disabled={isSaving}
                                sx={{ py: 1.5 }}
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserProfileOptions;
