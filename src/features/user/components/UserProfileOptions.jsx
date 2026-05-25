import { useEffect, useState } from 'react';

import { Avatar, Box, Button, Card, CardContent, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Cancel, CameraAlt, CheckCircle, Person, Save } from '@mui/icons-material';

import Swal from 'sweetalert2';

import userService from '@features/user/services/userService';

const UserProfileOptions = ({ userInfo, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dob: '',
        username: '',
        visibility: 'public',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [usernameAvailability, setUsernameAvailability] = useState({ checking: false, available: true, message: '' });

    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                phone: userInfo.phone || '',
                dob: userInfo.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '',
                username: userInfo.username || '',
                visibility: userInfo.visibility || 'public',
            });
            setPreviewUrl(userInfo.profilePicture || null);
        }
    }, [userInfo]);

    // Live Username Check with a simple debounced check
    useEffect(() => {
        if (!formData.username) return;
        const cleanUsername = formData.username.toLowerCase().trim();
        
        if (userInfo && cleanUsername === userInfo.username?.toLowerCase()) {
            setUsernameAvailability({ checking: false, available: true, message: 'This is your current username' });
            return;
        }

        // Local format validation first
        const slugRegex = /^[a-z0-9-_]+$/;
        if (cleanUsername.length < 3 || cleanUsername.length > 30 || !slugRegex.test(cleanUsername)) {
            setUsernameAvailability({ checking: false, available: false, message: 'Must be 3-30 characters & alphanumeric (with - and _)' });
            return;
        }

        setUsernameAvailability({ checking: true, available: true, message: 'Checking availability...' });
        const timer = setTimeout(async () => {
            try {
                // Using relative path representing proxy or import
                const res = await fetch(`${window.location.origin.includes('5173') ? 'http://localhost:5000' : ''}/api/public/username-check/${cleanUsername}`);
                const data = await res.json();
                if (data.success && data.data) {
                    if (data.data.available) {
                        setUsernameAvailability({ checking: false, available: true, message: 'Username is available!' });
                    } else {
                        setUsernameAvailability({ checking: false, available: false, message: data.data.reason || 'Username is taken' });
                    }
                } else {
                    setUsernameAvailability({ checking: false, available: false, message: data.message || 'Validation failed' });
                }
            } catch (err) {
                setUsernameAvailability({ checking: false, available: true, message: 'Network check skipped' });
            }
        }, 600);

        return () => clearTimeout(timer);
    }, [formData.username, userInfo]);

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

        if (!usernameAvailability.available) {
            Swal.fire({ title: 'Invalid Username', text: usernameAvailability.message, icon: 'warning' });
            setIsSaving(false);
            return;
        }

        try {
            const data = new FormData();
            if (formData.name)  data.append('name',  formData.name);
            if (formData.phone) data.append('phone', formData.phone);
            if (formData.dob)   data.append('dob',   formData.dob);
            if (formData.username) data.append('username', formData.username);
            if (formData.visibility) data.append('visibility', formData.visibility);
            if (profileImage)   data.append('profilePicture', profileImage);

            const result = await userService.updateProfile(data);
            onUpdate(result.user || result);

            Swal.fire({ title: 'Success', text: 'Profile updated successfully', icon: 'success', background: '#ffffff', color: '#111827', iconColor: '#2EC4B6', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Failed to update profile', icon: 'error', background: '#ffffff', color: '#111827' });
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
                                label="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                required
                                error={!usernameAvailability.available}
                                helperText={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, color: usernameAvailability.available ? 'success.main' : 'error.main' }}>
                                        {usernameAvailability.checked || usernameAvailability.message ? (
                                            usernameAvailability.available ? <CheckCircle fontSize="inherit" /> : <Cancel fontSize="inherit" />
                                        ) : null}
                                        <span>{usernameAvailability.message || 'Choose a unique username for your public profile'}</span>
                                    </Box>
                                }
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="visibility-label">Profile Visibility</InputLabel>
                                <Select
                                    labelId="visibility-label"
                                    name="visibility"
                                    value={formData.visibility}
                                    onChange={handleChange}
                                    label="Profile Visibility"
                                >
                                    <MenuItem value="public">Public (Everyone can see your profile card)</MenuItem>
                                    <MenuItem value="unlisted">Unlisted (Only people with the link can see)</MenuItem>
                                    <MenuItem value="private">Private (Only you and administrators can see)</MenuItem>
                                </Select>
                                <FormHelperText>
                                    Control who can view your public card at {window.location.origin}/u/{formData.username || 'username'}
                                </FormHelperText>
                            </FormControl>
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

