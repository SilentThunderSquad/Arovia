import { useState, useEffect, useRef } from 'react';
import {
    Grid, TextField, Button, MenuItem,
    FormControlLabel, Switch, Typography, Box,
    InputAdornment, Alert, IconButton, Avatar
} from '@mui/material';
import { UploadFile, Save, CameraAlt } from '@mui/icons-material';
import SidePanel from './SidePanel';
import { fetchLocationByPincode } from '../../utils/pincodeService';
import Swal from 'sweetalert2';

const ProfilePanel = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        country: 'India',
        pincode: '',
        state: '',
        city: '',
        address1: '',
        address2: '',
        landmark: '',
        bloodDonation: false,
        prescription: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    // Initialize form data when user prop updates
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',

                // Address Mapping
                country: user.address?.country || 'India',
                state: user.address?.state || '',
                city: user.address?.city || '',
                pincode: user.address?.pincode || '',
                address1: user.address?.addressLine1 || '',
                address2: user.address?.addressLine2 || '',

                // Other fields
                bloodDonation: user.bloodDonor || false,
                prescription: null // Don't preset file input
            }));

            if (user.profilePicture) {
                // Ensure we handle both full URLs (if stored that way) and relative paths
                const avatarSrc = user.profilePicture.startsWith('http')
                    ? user.profilePicture
                    : `${window.location.origin}${user.profilePicture}`;
                setPreviewUrl(avatarSrc);
            }
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Pincode Logic
    const handlePincodeChange = async (e) => {
        const pin = e.target.value;
        setFormData(prev => ({ ...prev, pincode: pin }));

        if (pin.length === 6) {
            const location = await fetchLocationByPincode(pin);
            if (!location.error) {
                setFormData(prev => ({
                    ...prev,
                    state: location.state,
                    city: location.city
                }));
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, prescription: file }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Include avatarFile in the data if needed, or handle separate upload
        onSave({ ...formData, avatarFile });
        onClose();
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile details have been saved successfully.',
            timer: 2000,
            showConfirmButton: false
        });
    };

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Edit Profile" width="75%">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    {/* Left Sidebar - Avatar & Bio */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 3,
                            bgcolor: 'white', // Or a light grey card
                            borderRadius: 2,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
                        }}>
                            {/* Avatar Container */}
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <Avatar
                                    src={previewUrl}
                                    sx={{
                                        width: 120,
                                        height: 120,
                                        bgcolor: '#0F4C5C',
                                        fontSize: '3rem',
                                        fontWeight: 'bold',
                                        border: '4px solid white',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {!previewUrl && user?.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <IconButton
                                    onClick={triggerFileInput}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: '#0F4C5C',
                                        color: 'white',
                                        border: '2px solid white',
                                        '&:hover': { bgcolor: '#093a47' },
                                        width: 36,
                                        height: 36
                                    }}
                                    size="small"
                                >
                                    <CameraAlt fontSize="small" />
                                </IconButton>
                                <input
                                    type="file"
                                    hidden
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </Box>

                            <Typography variant="h5" fontWeight="bold" gutterBottom>
                                {user?.name || 'User Name'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {user?.email || 'user@example.com'}
                            </Typography>

                            <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                                About
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                I'm {user?.name}, currently managing my health profile on Arovia.
                                I enjoy staying healthy and tracking my daily activities.
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Right Content - Form */}
                    <Grid item xs={12} md={8}>
                        {/* Profile Summary Section */}
                        <Box sx={{ mb: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2, border: '1px solid #e9ecef' }}>
                            <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Profile Summary
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Full Name</Typography>
                                    <Typography variant="body1" fontWeight="500">{user?.name}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Email</Typography>
                                    <Typography variant="body1" fontWeight="500">{user?.email}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                                    <Typography variant="body1" fontWeight="500">{user?.phone || 'Not provided'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="text.secondary">Location</Typography>
                                    <Typography variant="body1" fontWeight="500">
                                        {user?.address?.city ? `${user.address.city}, ${user.address.state}` : 'Not provided'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', pb: 1, display: 'inline-block' }}>
                                Personal Details
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Full Name" fullWidth
                                        name="name" value={formData.name || ''}
                                        onChange={handleChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Email" fullWidth
                                        name="email" value={formData.email || ''}
                                        disabled // Read-only
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Phone Number" fullWidth
                                        name="phone" value={formData.phone || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Date of Birth" fullWidth type="date"
                                        name="dob" value={formData.dob ? formData.dob.split('T')[0] : ''}
                                        onChange={handleChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', pb: 1, display: 'inline-block' }}>
                                Address
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Address Line 1" fullWidth
                                        name="address1" value={formData.address1 || ''}
                                        onChange={handleChange} required
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Address Line 2" fullWidth
                                        name="address2" value={formData.address2 || ''}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="City / District" fullWidth
                                        name="city" value={formData.city || ''}
                                        onChange={handleChange}
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="State" fullWidth
                                        name="state" value={formData.state || ''}
                                        onChange={handleChange}
                                        InputProps={{ readOnly: true }}
                                        helperText="Auto-filled from Pincode"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Pincode" fullWidth
                                        name="pincode" value={formData.pincode || ''}
                                        onChange={handlePincodeChange}
                                        inputProps={{ maxLength: 6 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select label="Country" fullWidth
                                        name="country" value={formData.country}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="India">India</MenuItem>
                                        <MenuItem value="USA">USA</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', pb: 1, display: 'inline-block' }}>
                                Other Preferences
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.bloodDonation}
                                                onChange={handleChange}
                                                name="bloodDonation"
                                                color="secondary"
                                            />
                                        }
                                        label="Interested in Blood Donation"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Button
                                        variant="outlined" component="label" fullWidth
                                        startIcon={<UploadFile />}
                                    >
                                        Upload Prescription
                                        <input type="file" hidden accept=".jpg,.png,.pdf" onChange={handleFileChange} />
                                    </Button>
                                    {formData.prescription && (
                                        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                            Selected: {formData.prescription.name}
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                size="large"
                                sx={{ color: '#666', borderColor: '#ccc' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<Save />}
                                sx={{
                                    bgcolor: '#0F4C5C',
                                    color: 'white',
                                    '&:hover': { bgcolor: '#093a47' },
                                    px: 4
                                }}
                            >
                                Update
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </SidePanel>
    );
};

export default ProfilePanel;
