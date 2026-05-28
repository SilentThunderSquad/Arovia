'use strict';

import { useEffect, useRef, useState } from 'react';

import { Alert, Avatar, Box, Button, Card, CardContent, CircularProgress, Divider, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Skeleton, Switch, Tab, Tabs, TextField, Typography } from '@mui/material';
import { CameraAlt, Cancel, CheckCircle, History, Map, Person, PrivacyTip, Refresh, Save, Security, Warning } from '@mui/icons-material';

import Swal from 'sweetalert2';

import userService from '@features/user/services/userService';

import { useAuth } from '@shared/hooks/useAuth';
import { fetchLocationByPincode } from '@shared/utils/pincode';
import logger from '@shared/utils/logger';

const DashboardSettings = ({ user, onUpdate, initialTab = 0 }) => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  
  // Base states
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',
    bloodDonor: false
  });
  
  const [accountForm, setAccountForm] = useState({
    username: '',
    email: '',
    visibility: 'public'
  });
  
  const [addressForm, setAddressForm] = useState({
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    addressLine1: '',
    addressLine2: ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState({ checking: false, available: true, message: '' });
  const [usernameHistory, setUsernameHistory] = useState([]);
  
  const fileInputRef = useRef(null);

  // Sync state from prop
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        gender: user.gender || 'Prefer not to say',
        bloodDonor: user.bloodDonor || false
      });
      setAccountForm({
        username: user.username || '',
        email: user.email || '',
        visibility: user.visibility || 'public'
      });
      setAddressForm({
        country: user.address?.country || 'India',
        state: user.address?.state || '',
        city: user.address?.city || '',
        pincode: user.address?.pincode || '',
        addressLine1: user.address?.addressLine1 || '',
        addressLine2: user.address?.addressLine2 || ''
      });
      setAvatarPreview(user.profilePicture || '');
      // TODO: This endpoint doesn't exist in the API yet
      // fetchUsernameHistory();
    }
  }, [user]);

  // Fetch username reservation log history
  const fetchUsernameHistory = async () => {
    try {
      const res = await fetch(`${window.location.origin.includes('5173') ? 'http://localhost:5000' : ''}/api/public/username-history/${user?.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setUsernameHistory(data.data);
      }
    } catch (err) {
      logger.debug('Skipped username history fetch', { reason: 'endpoint_not_implemented' }, 'USER');
    }
  };

  // Live debounced username validator
  useEffect(() => {
    if (!accountForm.username) return;
    const cleanUsername = accountForm.username.toLowerCase().trim();
    if (cleanUsername === user?.username?.toLowerCase()) {
      setUsernameStatus({ checking: false, available: true, message: 'This is your current username' });
      return;
    }

    const regex = /^[a-z0-9-_]+$/;
    if (cleanUsername.length < 3 || cleanUsername.length > 30 || !regex.test(cleanUsername)) {
      setUsernameStatus({ checking: false, available: false, message: 'Must be 3-30 characters & alphanumeric (with - and _)' });
      return;
    }

    setUsernameStatus({ checking: true, available: true, message: 'Verifying availability...' });
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${window.location.origin.includes('5173') ? 'http://localhost:5000' : ''}/api/public/username-check/${cleanUsername}`);
        const data = await res.json();
        if (data.success && data.data) {
          if (data.data.available) {
            setUsernameStatus({ checking: false, available: true, message: 'Username is available!' });
          } else {
            setUsernameStatus({ checking: false, available: false, message: data.data.reason || 'Username is taken' });
          }
        }
      } catch (err) {
        setUsernameStatus({ checking: false, available: true, message: 'Online verification skipped' });
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [accountForm.username, user]);

  // Form input changes
  const handleProfileChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setDirty(true);
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
    if (name === 'pincode' && value.length === 6) lookupPincode(value);
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Error', 'Image size must be less than 2MB', 'error');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setDirty(true);
    }
  };

  const lookupPincode = async (pin) => {
    if (!pin || pin.length !== 6) {
      logger.warn('Invalid pincode format', { pincode: pin }, 'USER');
      return;
    }
    
    setLoading(true);
    try {
      const location = await fetchLocationByPincode(pin);
      
      if (location.error) {
        logger.warn('Pincode lookup failed', { error: location.error, pincode: pin }, 'USER');
        Swal.fire({
          title: 'Invalid Pincode',
          text: location.error,
          icon: 'warning',
          background: '#ffffff',
          color: '#111827',
          toast: true,
          position: 'bottom-end',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        setAddressForm(prev => ({ 
          ...prev, 
          city: location.city || '', 
          state: location.state || '' 
        }));
        
        Swal.fire({
          title: 'Location Detected',
          text: `${location.city}, ${location.state}`,
          icon: 'success',
          background: '#ffffff',
          color: '#111827',
          toast: true,
          position: 'bottom-end',
          timer: 2000,
          showConfirmButton: false
        });
        
        logger.debug('Pincode lookup successful', { pincode: pin, state: location.state, city: location.city }, 'USER');
      }
    } catch (error) {
      logger.warn('Pincode lookup error', { error: error.message, pincode: pin }, 'USER');
      Swal.fire({
        title: 'Lookup Failed',
        text: 'Could not fetch location details. Please enter manually.',
        icon: 'error',
        background: '#ffffff',
        color: '#111827',
        toast: true,
        position: 'bottom-end',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Discard local edits
  const handleDiscard = () => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob ? user.dob.split('T')[0] : '',
        gender: user.gender || 'Prefer not to say',
        bloodDonor: user.bloodDonor || false
      });
      setAccountForm({
        username: user.username || '',
        email: user.email || '',
        visibility: user.visibility || 'public'
      });
      setAddressForm({
        country: user.address?.country || 'India',
        state: user.address?.state || '',
        city: user.address?.city || '',
        pincode: user.address?.pincode || '',
        addressLine1: user.address?.addressLine1 || '',
        addressLine2: user.address?.addressLine2 || ''
      });
      setAvatarPreview(user.profilePicture || '');
      setAvatarFile(null);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setDirty(false);
      Swal.fire({ title: 'Changes Discarded', icon: 'info', timer: 1000, showConfirmButton: false });
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      // 1. If security passwords changed, submit password update first
      if (securityForm.newPassword) {
        if (securityForm.newPassword !== securityForm.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (securityForm.newPassword.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        await userService.changePassword(securityForm.currentPassword, securityForm.newPassword);
      }

      // 2. Submit general profile update
      const formData = new FormData();
      formData.append('name', profileForm.name);
      formData.append('phone', profileForm.phone);
      formData.append('dob', profileForm.dob);
      formData.append('gender', profileForm.gender);
      formData.append('bloodDonor', profileForm.bloodDonor);
      formData.append('username', accountForm.username.toLowerCase().trim());
      formData.append('visibility', accountForm.visibility);
      if (avatarFile) formData.append('profilePicture', avatarFile);

      formData.append('address', JSON.stringify({
        country: addressForm.country,
        state: addressForm.state,
        city: addressForm.city,
        pincode: addressForm.pincode,
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2
      }));

      const data = await userService.updateProfile(formData);
      if (onUpdate) onUpdate(data.user || data);
      
      setDirty(false);
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      await fetchUsernameHistory();
      
      Swal.fire({ icon: 'success', title: 'Settings Saved', text: 'Your clinical details have been successfully secured.', timer: 2000, showConfirmButton: false });
    } catch (err) {
      Swal.fire('Error Saving', err.message || 'Verification rejected', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete account trigger
  const handleDeleteAccount = async () => {
    const { value: confirmText } = await Swal.fire({
      title: 'Delete Account Permanent?',
      html: `<p style="font-size: 0.95rem; color: #6b7280;">This will permanently wipe your profiles, addresses, prescriptions and credentials.</p><p>Type <b>DELETE</b> to confirm.</p>`,
      icon: 'warning',
      input: 'text',
      inputPlaceholder: 'DELETE',
      showCancelButton: true,
      confirmButtonColor: '#e63946',
      confirmButtonText: 'Confirm Wipeout',
      background: '#ffffff',
      color: '#111827'
    });

    if (confirmText === 'DELETE') {
      try {
        await userService.deleteAccount();
        await logout();
        Swal.fire({ title: 'Account Deleted', text: 'Your profiles have been wiped.', icon: 'success', timer: 2000, showConfirmButton: false });
        setTimeout(() => window.location.replace('/'), 2000);
      } catch (err) {
        Swal.fire('Delete Failed', 'Please try again', 'error');
      }
    }
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Settings Grid Header */}
      <Card sx={{ mb: 4, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        <CardContent sx={{ p: 0 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              '& .MuiTab-root': { py: 2, fontWeight: 700, minWidth: 100, fontSize: '0.85rem', textTransform: 'none' },
              '& .MuiTabs-indicator': { bgcolor: '#2EC4B6', height: 3 }
            }}
          >
            <Tab label="Profile" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Account" icon={<PrivacyTip sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Addresses" icon={<Map sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Security" icon={<Security sx={{ fontSize: 18 }} />} iconPosition="start" />
            <Tab label="Danger Zone" icon={<Warning sx={{ fontSize: 18 }} />} iconPosition="start" />
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Tab Panels */}
      <Box sx={{ pb: 10 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, textAlign: 'center' }}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Avatar 
                    src={avatarPreview} 
                    sx={{ width: 140, height: 140, border: '6px solid white', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', bgcolor: '#0F4C5C', fontSize: '3rem', fontWeight: 'bold' }}
                  >
                    {profileForm.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <IconButton 
                    component="label" 
                    sx={{ position: 'absolute', bottom: 5, right: 5, bgcolor: '#0F4C5C', color: 'white', border: '2px solid white', '&:hover': { bgcolor: '#2EC4B6' } }}
                  >
                    <CameraAlt fontSize="small" />
                    <input hidden accept="image/*" type="file" ref={fileInputRef} onChange={handleAvatarChange} />
                  </IconButton>
                </Box>
                <Typography variant="h6" fontWeight="800" color="text.primary">{profileForm.name || 'Your Name'}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 3 }}>{accountForm.email}</Typography>
                <Alert severity="info" sx={{ width: '100%', borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.75rem', fontWeight: 500 } }}>
                  Upload a clean JPG/PNG image. Less than 2MB size.
                </Alert>
              </Card>
            </Grid>
            <Grid xs={12} md={8}>
              <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" fontWeight="800" color="#0F4C5C" mb={3}>Personal Details</Typography>
                  <Grid container spacing={3}>
                    <Grid xs={12} sm={6}>
                      <TextField label="Full Name" fullWidth name="name" value={profileForm.name} onChange={handleProfileChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField label="Phone Number" fullWidth name="phone" value={profileForm.phone} onChange={handleProfileChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField label="Date of Birth" type="date" fullWidth name="dob" value={profileForm.dob} onChange={handleProfileChange} InputLabelProps={{ shrink: true }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <TextField select SelectProps={{ native: true }} label="Gender" fullWidth name="gender" value={profileForm.gender} onChange={handleProfileChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </TextField>
                    </Grid>
                    <Grid xs={12}>
                      <Box sx={{ bgcolor: 'rgba(46, 196, 182, 0.05)', p: 3, borderRadius: 3, border: '1px solid rgba(46, 196, 182, 0.1)' }}>
                        <FormControlLabel 
                          control={<Switch checked={profileForm.bloodDonor} onChange={handleProfileChange} name="bloodDonor" />} 
                          label={<Typography fontWeight="600" sx={{ fontSize: '0.85rem' }}>Interested in Blood Donation</Typography>} 
                        />
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, pl: 7 }}>
                          By enabling, you opt-in to be registered as an active blood donor in emergency medical clinical schedules.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', p: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="800" color="#0F4C5C" mb={3}>Account Settings</Typography>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <TextField 
                    label="Username" 
                    fullWidth 
                    name="username" 
                    value={accountForm.username} 
                    onChange={handleAccountChange} 
                    InputProps={{
                      startAdornment: <InputAdornment position="start">@</InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          {usernameStatus.checking ? (
                            <CircularProgress size={16} />
                          ) : usernameStatus.available ? (
                            <CheckCircle sx={{ color: 'green', fontSize: 18 }} />
                          ) : (
                            <Cancel sx={{ color: 'red', fontSize: 18 }} />
                          )}
                        </InputAdornment>
                      )
                    }}
                    helperText={usernameStatus.message}
                    FormHelperTextProps={{ sx: { color: usernameStatus.available ? 'green' : 'red', fontWeight: 600 } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} 
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField label="Email Address" fullWidth disabled name="email" value={accountForm.email} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#F8F9FA' } }} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField select SelectProps={{ native: true }} label="Profile Visibility" fullWidth name="visibility" value={accountForm.visibility} onChange={handleAccountChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                    <option value="public">Public (Indexed on search engines)</option>
                    <option value="unlisted">Unlisted (Direct links only)</option>
                    <option value="private">Private (Only you can access)</option>
                  </TextField>
                </Grid>
              </Grid>

              {usernameHistory.length > 0 && (
                <Box sx={{ mt: 5 }}>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <History sx={{ color: '#0F4C5C' }} />
                    <Typography variant="subtitle2" fontWeight="800" color="text.primary">Username History Logs</Typography>
                  </Box>
                  <List sx={{ bgcolor: '#F8F9FA', borderRadius: 2, p: 1, border: '1px solid rgba(0,0,0,0.04)' }}>
                    {usernameHistory.map((log, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemText 
                          primary={`@${log.old_username}`} 
                          secondary={`Released & archived on ${new Date(log.changed_at).toLocaleString()}`} 
                          primaryTypographyProps={{ fontWeight: 700, fontSize: '0.85rem', color: 'text.secondary' }}
                          secondaryTypographyProps={{ fontSize: '0.75rem' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', p: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="800" color="#0F4C5C" mb={3}>Clinical Mailing Address</Typography>
              <Grid container spacing={3}>
                <Grid xs={12} sm={4}>
                  <TextField label="Pincode" fullWidth name="pincode" value={addressForm.pincode} onChange={handleAddressChange} inputProps={{ maxLength: 6 }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={4}>
                  <TextField label="City" fullWidth name="city" value={addressForm.city} onChange={handleAddressChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={4}>
                  <TextField label="State" fullWidth name="state" value={addressForm.state} onChange={handleAddressChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField label="Address Line 1" fullWidth name="addressLine1" value={addressForm.addressLine1} onChange={handleAddressChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField label="Address Line 2 (Optional)" fullWidth name="addressLine2" value={addressForm.addressLine2} onChange={handleAddressChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 3 && (
          <Card sx={{ borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)', p: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="800" color="#0F4C5C" mb={3}>Update Credentials</Typography>
              <Grid container spacing={3}>
                <Grid xs={12}>
                  <TextField type="password" label="Current Credentials Password" fullWidth name="currentPassword" value={securityForm.currentPassword} onChange={handleSecurityChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField type="password" label="New Password" fullWidth name="newPassword" value={securityForm.newPassword} onChange={handleSecurityChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField type="password" label="Confirm New Password" fullWidth name="confirmPassword" value={securityForm.confirmPassword} onChange={handleSecurityChange} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card sx={{ border: '2px solid #e63946', borderRadius: 3, p: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Warning sx={{ color: '#e63946' }} />
                <Typography variant="h6" fontWeight="800" color="#e63946">Danger Zone</Typography>
              </Box>
              <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
                These operations are irreversible and permanent. Proceed with caution.
              </Alert>
              <Box sx={{ bgcolor: 'rgba(230, 57, 70, 0.04)', p: 3, borderRadius: 3, border: '1px solid rgba(230, 57, 70, 0.1)' }}>
                <Typography variant="subtitle2" fontWeight="700" color="text.primary" mb={0.5}>Delete Clinical Account</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Permanently wipe all records, custom usernames and file vaults. Wiped profiles cannot be restored.
                </Typography>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={handleDeleteAccount}
                  sx={{ bgcolor: '#e63946', '&:hover': { bgcolor: '#c92a35' }, textTransform: 'none', px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
                >
                  Delete My Account
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Sticky Stripe/Linear unsaved changes indicator banner */}
      {dirty && (
        <Card 
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            left: { xs: 16, md: 'calc(240px + 32px)' }, 
            right: 16, 
            bgcolor: '#0F4C5C', 
            color: 'white', 
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(15, 76, 92, 0.3)',
            zIndex: 1000,
            border: 'none'
          }}
        >
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '16px !important', px: 3 }}>
            <Typography variant="body2" fontWeight="600">
              Careful — you have unsaved configuration updates!
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleDiscard}
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.3)', 
                  color: 'white', 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontSize: '0.8rem',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)', transform: 'none' } 
                }}
              >
                Discard
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                disabled={saving || !usernameStatus.available}
                onClick={handleSaveChanges}
                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save />}
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  fontSize: '0.8rem',
                  bgcolor: '#2EC4B6',
                  color: 'white',
                  '&:hover': { bgcolor: '#25a89c', transform: 'none' } 
                }}
              >
                {saving ? 'Securing...' : 'Save Changes'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardSettings;
