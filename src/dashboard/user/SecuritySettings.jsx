import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Switch,
    FormControlLabel,
    Divider,
} from '@mui/material';
import { Lock, Favorite, Security } from '@mui/icons-material';
import Swal from 'sweetalert2';

const SecuritySettings = ({ userInfo, onUpdate }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [bloodDonorStatus, setBloodDonorStatus] = useState(userInfo?.bloodDonor || false);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return Swal.fire({
                title: 'Error',
                text: 'New passwords do not match',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        }
        if (passwords.new.length < 8) {
            return Swal.fire({
                title: 'Error',
                text: 'Password must be at least 8 characters',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        }

        setIsUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to change password');

            Swal.fire({
                title: 'Success',
                text: 'Password changed successfully',
                icon: 'success',
                background: '#ffffff',
                color: '#111827',
                iconColor: '#2EC4B6',
            });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleBloodDonor = async (event) => {
        const newValue = event.target.checked;

        if (newValue) {
            const result = await Swal.fire({
                title: 'Become a Blood Donor?',
                text: 'By agreeing, you consent to be contacted for blood donation emergencies.',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, I Agree',
                background: '#ffffff',
                color: '#111827',
            });
            if (!result.isConfirmed) return;
        }

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
                body: JSON.stringify({ bloodDonor: newValue }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            setBloodDonorStatus(newValue);
            if (userInfo) userInfo.bloodDonor = newValue;

            Swal.fire({
                title: newValue ? 'Thank You!' : 'Status Updated',
                text: newValue
                    ? 'You are now a registered blood donor.'
                    : 'You have opted out of blood donation.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#ffffff',
                color: '#111827',
                iconColor: '#2EC4B6',
            });
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to update blood donor status',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        }
    };

    return (
        <Grid container spacing={3}>
            {/* Security Section */}
            <Grid item xs={12} md={6}>
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
                            <Security sx={{ mr: 1, color: '#0F4C5C', fontSize: 28 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>
                                Security
                            </Typography>
                        </Box>

                        <Box component="form" onSubmit={submitPasswordChange}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Current Password"
                                        name="current"
                                        value={passwords.current}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="New Password"
                                        name="new"
                                        value={passwords.new}
                                        onChange={handlePasswordChange}
                                        required
                                        helperText="Minimum 8 characters"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        label="Confirm Password"
                                        name="confirm"
                                        value={passwords.confirm}
                                        onChange={handlePasswordChange}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        startIcon={<Lock />}
                                        disabled={isUpdating}
                                        sx={{ py: 1.5 }}
                                    >
                                        {isUpdating ? 'Updating...' : 'Update Password'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Blood Donation Section */}
            <Grid item xs={12} md={6}>
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
                            <Favorite sx={{ mr: 1, color: '#ef4444', fontSize: 28 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>
                                Blood Donation
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                            Help save lives by registering as a blood donor. You'll only be contacted in
                            emergencies.
                        </Typography>

                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: bloodDonorStatus ? '#dcfce7' : '#F8F9FA',
                                border: `2px solid ${bloodDonorStatus ? '#2EC4B6' : '#e5e7eb'}`,
                                transition: 'all 0.3s',
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={bloodDonorStatus}
                                        onChange={toggleBloodDonor}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#2EC4B6',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#2EC4B6',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#111827' }}>
                                        {bloodDonorStatus ? 'I am a Donor ❤️' : 'Not a Donor'}
                                    </Typography>
                                }
                            />

                            {bloodDonorStatus && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #2EC4B6' }}>
                                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 500 }}>
                                        ✓ Thank you for being a lifesaver!
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default SecuritySettings;
