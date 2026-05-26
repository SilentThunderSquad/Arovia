import { useEffect, useState } from 'react';

import { Box, Button, Card, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LocationOn, Save } from '@mui/icons-material';

import Swal from 'sweetalert2';

import userService from '@features/user/services/userService';
import { fetchLocationByPincode } from '@shared/utils/pincode';
import logger from '@shared/utils/logger';

const AddressManager = ({ userInfo, onUpdate }) => {
    const [address, setAddress] = useState({
        country: 'India', state: '', pincode: '', city: '',
        addressLine1: '', addressLine2: '', landmark: '',
    });
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userInfo?.address) setAddress((prev) => ({ ...prev, ...userInfo.address }));
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        
        // Trigger pincode lookup when user finishes typing (blur would be better, but this works)
        if (name === 'pincode' && value.length === 6) {
            lookupPincode(value);
        }
    };

    const lookupPincode = async (pincode) => {
        if (!pincode || pincode.length !== 6) {
            logger.warn('Invalid pincode format', { pincode }, 'USER');
            return;
        }
        
        setIsSearching(true);
        try {
            const location = await fetchLocationByPincode(pincode);
            
            if (location.error) {
                logger.warn('Pincode lookup failed', { error: location.error, pincode }, 'USER');
                Swal.fire({
                    title: 'Pincode Not Found',
                    text: 'Please enter a valid Indian pincode',
                    icon: 'warning',
                    background: '#ffffff',
                    color: '#111827'
                });
            } else {
                setAddress((prev) => ({
                    ...prev,
                    city: location.city || '',
                    state: location.state || '',
                    country: 'India'
                }));
                
                logger.debug('Pincode lookup successful', { pincode, state: location.state, city: location.city }, 'USER');
            }
        } catch (error) {
            logger.warn('Pincode lookup failed', { error: error.message, pincode }, 'USER');
            Swal.fire({
                title: 'Lookup Failed',
                text: 'Could not fetch location details. Please enter manually.',
                icon: 'error',
                background: '#ffffff',
                color: '#111827'
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedUser = await userService.updateAddress(address);
            if (onUpdate) onUpdate(updatedUser.user || updatedUser);
            Swal.fire({ title: 'Success', text: 'Address updated successfully', icon: 'success', background: '#ffffff', color: '#111827', iconColor: '#2EC4B6', timer: 1500, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Failed to update address', icon: 'error', background: '#ffffff', color: '#111827' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card sx={{ height: '100%', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocationOn sx={{ mr: 1, color: '#0F4C5C', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>Address Management</Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Country</InputLabel>
                                <Select name="country" value={address.country} onChange={handleChange} label="Country">
                                    <MenuItem value="India">India</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth label="Pincode" name="pincode" value={address.pincode} onChange={handleChange}
                                inputProps={{ maxLength: 6 }} placeholder="Enter 6-digit pincode" required
                                InputProps={{ endAdornment: isSearching && <CircularProgress size={20} sx={{ color: '#2EC4B6' }} /> }}
                            />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth label="State" name="state" value={address.state} InputProps={{ readOnly: true }} placeholder="Auto-filled" />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth label="City / District" name="city" value={address.city} InputProps={{ readOnly: true }} placeholder="Auto-filled" />
                        </Grid>
                        <Grid xs={12}>
                            <TextField fullWidth label="Address Line 1" name="addressLine1" value={address.addressLine1} onChange={handleChange} placeholder="House No., Building, Street" required />
                        </Grid>
                        <Grid xs={12}>
                            <TextField fullWidth label="Address Line 2 (Optional)" name="addressLine2" value={address.addressLine2} onChange={handleChange} placeholder="Apartment, Studio, Floor" />
                        </Grid>
                        <Grid xs={12}>
                            <TextField fullWidth label="Landmark (Optional)" name="landmark" value={address.landmark} onChange={handleChange} placeholder="Near Famous Place" />
                        </Grid>
                        <Grid xs={12}>
                            <Button type="submit" fullWidth variant="contained" startIcon={<Save />} disabled={isSaving} sx={{ py: 1.5 }}>
                                {isSaving ? 'Saving...' : 'Save Address'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default AddressManager;

