import { useState } from 'react';
import { Grid, TextField, Button, Alert, Box, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';
import SidePanel from './SidePanel';
import Swal from 'sweetalert2';

const PasswordPanel = ({ isOpen, onClose }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (passwords.new !== passwords.confirm) {
            setError("New passwords don't match");
            return;
        }

        if (passwords.new.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        // Mock API call
        console.log('Updating password:', passwords);

        Swal.fire({
            icon: 'success',
            title: 'Password Changed',
            text: 'Your password has been updated successfully.',
            timer: 2000,
            showConfirmButton: false
        });

        setPasswords({ current: '', new: '', confirm: '' });
        onClose();
    };

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Change Password">
            <Box component="form" onSubmit={handleSubmit} sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                py: 2
            }}>
                {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ ml: 1 }}>CURRENT PASSWORD</Typography>
                    <TextField
                        type="password"
                        fullWidth
                        name="current"
                        placeholder="Enter current password"
                        value={passwords.current}
                        onChange={handleChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ ml: 1 }}>NEW PASSWORD</Typography>
                    <TextField
                        type="password"
                        fullWidth
                        name="new"
                        placeholder="Enter new password"
                        value={passwords.new}
                        onChange={handleChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } }}
                    />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ ml: 1 }}>CONFIRM NEW PASSWORD</Typography>
                    <TextField
                        type="password"
                        fullWidth
                        name="confirm"
                        placeholder="Confirm new password"
                        value={passwords.confirm}
                        onChange={handleChange}
                        required
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } }}
                    />
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        startIcon={<Save />}
                        sx={{
                            borderRadius: 10,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: '#0F4C5C',
                            color: 'white',
                            py: 1.5,
                            boxShadow: '0 4px 14px 0 rgba(15, 76, 92, 0.39)',
                            '&:hover': { bgcolor: '#093a47', boxShadow: '0 6px 20px 0 rgba(15, 76, 92, 0.23)' }
                        }}
                    >
                        Update Password
                    </Button>
                </Box>
            </Box>
        </SidePanel>
    );
};

export default PasswordPanel;
