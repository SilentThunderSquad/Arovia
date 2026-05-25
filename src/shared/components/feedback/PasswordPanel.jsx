import { useState } from 'react';

import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Save } from '@mui/icons-material';

import Swal from 'sweetalert2';

import SidePanel from '@shared/components/layout/SidePanel';

import userService from '@features/user/services/userService';

const PasswordPanel = ({ isOpen, onClose, userEmail }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => { setPasswords({ ...passwords, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) { setError("New passwords don't match"); return; }
    if (passwords.new.length < 6) { setError('New password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      await userService.changePassword(passwords.current, passwords.new);
      Swal.fire({ icon: 'success', title: 'Password Changed', text: 'Your password has been updated successfully.', timer: 2000, showConfirmButton: false });
      setPasswords({ current: '', new: '', confirm: '' });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidePanel isOpen={isOpen} onClose={onClose} title="Change Password">
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 4, py: 2 }}>
        {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}
        {[
          { label: 'CURRENT PASSWORD', name: 'current', placeholder: 'Enter current password' },
          { label: 'NEW PASSWORD',     name: 'new',     placeholder: 'Enter new password' },
          { label: 'CONFIRM NEW PASSWORD', name: 'confirm', placeholder: 'Confirm new password' },
        ].map(({ label, name, placeholder }) => (
          <Box key={name} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ ml: 1 }}>{label}</Typography>
            <TextField type="password" fullWidth name={name} placeholder={placeholder} value={passwords[name]} onChange={handleChange} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'rgba(0,0,0,0.02)' } }} />
          </Box>
        ))}
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" fullWidth size="large" startIcon={<Save />} disabled={isLoading} sx={{ borderRadius: 10, textTransform: 'none', fontWeight: 700, bgcolor: '#0F4C5C', color: 'white', py: 1.5, boxShadow: '0 4px 14px 0 rgba(15, 76, 92, 0.39)', '&:hover': { bgcolor: '#093a47' } }}>
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Box>
    </SidePanel>
  );
};

export default PasswordPanel;
