import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    TextField,
    Alert,
} from '@mui/material';
import { Warning, Delete } from '@mui/icons-material';
import Swal from 'sweetalert2';

const DangerZone = () => {
    const handleDeleteAccount = async () => {
        const { value: confirmText } = await Swal.fire({
            title: 'Delete Account?',
            html: `
        <p>This will permanently delete your account and all associated data.</p>
        <p>Type <b>DELETE</b> to confirm.</p>
      `,
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'DELETE',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Permanently Delete',
            background: '#ffffff',
            color: '#111827',
        });

        if (confirmText === 'DELETE') {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                const response = await fetch(`${apiUrl}/api/user/delete-account`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to delete account');

                Swal.fire({
                    title: 'Account Deleted',
                    text: 'Your account has been removed. Goodbye.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#ffffff',
                    color: '#111827',
                    iconColor: '#2EC4B6',
                });

                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }, 2000);
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Could not delete account. Please try again.',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
            }
        }
    };

    return (
        <Card
            sx={{
                background: '#ffffff',
                border: '2px solid #ef4444',
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Warning sx={{ mr: 1, color: '#ef4444', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef4444' }}>
                        Danger Zone
                    </Typography>
                </Box>

                <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Warning: These actions are irreversible!
                    </Typography>
                </Alert>

                <Box
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: '#fef2f2',
                        border: '1px solid #fecaca',
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111827', mb: 1 }}>
                        Delete Account
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </Typography>

                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDeleteAccount}
                        sx={{
                            bgcolor: '#ef4444',
                            '&:hover': { bgcolor: '#dc2626' },
                            fontWeight: 600,
                        }}
                    >
                        Delete Account
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default DangerZone;
