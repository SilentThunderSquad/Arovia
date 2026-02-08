import { useState, useEffect, useRef } from 'react';
import {
    Grid, TextField, Button, MenuItem,
    FormControlLabel, Switch, Typography, Box,
    IconButton, Avatar, Drawer, InputAdornment
} from '@mui/material';
import { UploadFile, Close, CameraAlt } from '@mui/icons-material';
import { fetchLocationByPincode } from '../../utils/pincodeService';
import Swal from 'sweetalert2';

const ProfilePanel = ({ isOpen, onClose, user, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        gender: 'Prefer not to say',
        country: 'India',
        pincode: '',
        state: '',
        city: '',
        address1: '',
        address2: '',
        bloodDonation: false,
        prescription: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                dob: user.dob || '',
                gender: user.gender || 'Prefer not to say',
                country: user.address?.country || 'India',
                state: user.address?.state || '',
                city: user.address?.city || '',
                pincode: user.address?.pincode || '',
                address1: user.address?.addressLine1 || '',
                address2: user.address?.addressLine2 || '',
                bloodDonation: user.bloodDonor || false,
                prescription: null
            }));

            if (user.profilePicture) {
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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, avatarFile });
        onClose();
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your profile details have been saved successfully.',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-xl' }
        });
    };

    const SectionTitle = ({ title }) => (
        <Typography variant="h6" sx={{ color: '#0F4C5C', fontWeight: 700, mb: 2 }}>
            {title}
        </Typography>
    );

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            transitionDuration={500}
            PaperProps={{
                sx: {
                    width: { xs: '100%', md: '75%', lg: '65%' },
                    bgcolor: '#f8f9fa',
                    boxShadow: '-10px 0 50px rgba(0, 0, 0, 0.15)',
                    borderTopLeftRadius: { md: '40px' },
                    borderBottomLeftRadius: { md: '40px' },
                    overflowX: 'hidden'
                }
            }}
        >
            {/* Header with Gradient */}
            <Box sx={{
                background: 'linear-gradient(135deg, #0F4C5C 0%, #073B4C 100%)',
                height: 120,
                position: 'relative',
                borderTopLeftRadius: { md: '40px' },
                px: 4,
                py: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.5px' }}>
                    Edit Profile
                </Typography>
                <IconButton onClick={onClose} sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                    <Close />
                </IconButton>
            </Box>

            <Box sx={{ p: { xs: 2, md: 5 }, pt: 0 }}>
                <form onSubmit={handleSubmit}>
                    {/* Top Section: Avatar & Basic Info Container */}
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, mb: 4, mt: -4.5, gap: 3 }}>
                        <Box sx={{ position: 'relative' }}>
                            <Avatar
                                src={previewUrl}
                                sx={{
                                    width: 140,
                                    height: 140,
                                    border: '6px solid white',
                                    bgcolor: '#2d3748',
                                    fontSize: '3rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                {!previewUrl && user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                            <IconButton
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 5,
                                    right: 5,
                                    bgcolor: '#0F4C5C',
                                    color: 'white',
                                    border: '2px solid white',
                                    '&:hover': { bgcolor: '#093a47' },
                                    width: 40,
                                    height: 40
                                }}
                            >
                                <CameraAlt fontSize="small" />
                                <input hidden accept="image/*" type="file" ref={fileInputRef} onChange={handleAvatarChange} />
                            </IconButton>
                        </Box>

                        <Box sx={{ mb: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                            <Typography variant="h4" fontWeight="800" sx={{ color: '#1a202c' }}>
                                {user?.name}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#0F4C5C', fontWeight: 500 }}>
                                {user?.email}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#718096', mt: 0.5 }}>
                                Username: <span style={{ fontWeight: 600, color: '#0F4C5C' }}>@{user?.username || (localStorage.getItem('username') && localStorage.getItem('username') !== 'undefined' ? localStorage.getItem('username') : user?.name?.toLowerCase().replace(/\s/g, ''))}</span>
                            </Typography>
                        </Box>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 3, borderRadius: 3, mb: 1 }}>
                                <Typography variant="h6" sx={{ color: '#0F4C5C', fontWeight: 700, mb: 1 }}>About</Typography>
                                <Typography variant="body2" sx={{ color: '#4a5568', lineHeight: 1.6 }}>
                                    I'm {user?.name}, currently managing my health profile on Arovia. I enjoy staying healthy and tracking my daily activities.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <SectionTitle title="Profile Summary" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Full Name</Typography>
                                        <Box sx={{ bgcolor: '#f7fafc', p: 1.5, borderRadius: 1, border: '1px solid #edf2f7', fontWeight: 500 }}>{user?.name}</Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Email</Typography>
                                        <Box sx={{ bgcolor: '#f7fafc', p: 1.5, borderRadius: 1, border: '1px solid #edf2f7', fontWeight: 500 }}>{user?.email}</Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={3}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Phone</Typography>
                                        <Box sx={{ bgcolor: '#f7fafc', p: 1.5, borderRadius: 1, border: '1px solid #edf2f7', fontWeight: 500 }}>{user?.phone || 'N/A'}</Box>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={2}>
                                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Location</Typography>
                                        <Box sx={{ bgcolor: '#f7fafc', p: 1.5, borderRadius: 1, border: '1px solid #edf2f7', fontWeight: 500 }}>{user?.address?.city || 'N/A'}</Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                                <SectionTitle title="Personal Details" />
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}><TextField label="Full Name *" fullWidth name="name" value={formData.name || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                                    <Grid item xs={12} md={6}><TextField label="Email" fullWidth name="email" value={formData.email || ''} disabled sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f7fafc' } }} /></Grid>
                                    <Grid item xs={12} md={6}><TextField label="Phone Number" fullWidth name="phone" value={formData.phone || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                                    <Grid item xs={12} md={6}><TextField label="City / District" fullWidth name="city" value={formData.city || ''} InputProps={{ readOnly: true, endAdornment: formData.state && <InputAdornment position="end"><Typography variant="caption" sx={{ color: '#0F4C5C', fontWeight: 600 }}>{formData.state}</Typography></InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f8f9fa' } }} /></Grid>
                                    <Grid item xs={12} md={4}><TextField label="Pincode" fullWidth name="pincode" value={formData.pincode || ''} onChange={handlePincodeChange} inputProps={{ maxLength: 6 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                                    <Grid item xs={12} md={4}><TextField select label="Gender" fullWidth name="gender" value={formData.gender} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}><MenuItem value="Male">Male</MenuItem><MenuItem value="Female">Female</MenuItem><MenuItem value="Other">Other</MenuItem><MenuItem value="Prefer not to say">Prefer not to say</MenuItem></TextField></Grid>
                                    <Grid item xs={12} md={4}><TextField select label="Country" fullWidth name="country" value={formData.country} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}><MenuItem value="India">India</MenuItem><MenuItem value="USA">USA</MenuItem><MenuItem value="Other">Other</MenuItem></TextField></Grid>
                                    <Grid item xs={12}><TextField label="Full Address" fullWidth name="address1" value={formData.address1 || ''} onChange={handleChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} /></Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mb: 4 }}>
                                <SectionTitle title="Other Preferences" />
                                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center', bgcolor: 'rgba(0,0,0,0.02)', p: 3, borderRadius: 3 }}>
                                    <FormControlLabel control={<Switch checked={formData.bloodDonation} onChange={handleChange} name="bloodDonation" sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#0F4C5C' }, '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#0F4C5C' } }} />} label={<Typography fontWeight="500">Interested in Blood Donation</Typography>} sx={{ mr: 4 }} />
                                    <Button variant="outlined" component="label" startIcon={<UploadFile />} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e0', color: '#0F4C5C', py: 1.5, px: 3, bgcolor: 'white', '&:hover': { borderColor: '#0F4C5C', bgcolor: '#f0f9ff' } }}>Upload Prescription<input type="file" hidden accept=".jpg,.png,.pdf" onChange={handleFileChange} /></Button>
                                    {formData.prescription && <Typography variant="caption" sx={{ color: 'green', fontWeight: 600 }}>File Selected</Typography>}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pb: 4 }}>
                        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 700, color: '#4a5568', borderColor: '#cbd5e0', px: 4, py: 1.2, '&:hover': { borderColor: '#a0aec0', bgcolor: '#f7fafc' } }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 700, bgcolor: '#0F4C5C', color: 'white', px: 6, py: 1.2, boxShadow: '0 4px 14px 0 rgba(15, 76, 92, 0.39)', '&:hover': { bgcolor: '#093a47', boxShadow: '0 6px 20px 0 rgba(15, 76, 92, 0.23)' } }}>Update</Button>
                    </Box>
                </form>
            </Box>
        </Drawer>
    );
};

export default ProfilePanel;
