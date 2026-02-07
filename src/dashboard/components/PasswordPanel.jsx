import { useState } from 'react';
import { Grid, TextField, Button, Alert } from '@mui/material';
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
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <TextField
                            label="Current Password"
                            type="password"
                            fullWidth
                            name="current"
                            value={passwords.current}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="New Password"
                            type="password"
                            fullWidth
                            name="new"
                            value={passwords.new}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Confirm New Password"
                            type="password"
                            fullWidth
                            name="confirm"
                            value={passwords.confirm}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<Save />}
                            sx={{
                                bgcolor: '#0F4C5C',
                                color: 'white',
                                '&:hover': { bgcolor: '#093a47' }
                            }}
                        >
                            Update Password
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </SidePanel>
    );
};

export default PasswordPanel;
