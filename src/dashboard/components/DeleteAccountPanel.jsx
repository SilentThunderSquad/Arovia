import { useState } from 'react';
import { Box, Typography, Button, TextField, Alert } from '@mui/material';
import { Warning } from '@mui/icons-material';
import SidePanel from './SidePanel';
import Swal from 'sweetalert2';

const DeleteAccountPanel = ({ isOpen, onClose, onDeleteConfirm }) => {
    const [confirmationText, setConfirmationText] = useState('');
    const EXPECTED_TEXT = "DELETE MY ACCOUNT";

    const handleDelete = () => {
        if (confirmationText === EXPECTED_TEXT) {
            onDeleteConfirm();
            onClose();
        }
    };

    return (
        <SidePanel isOpen={isOpen} onClose={onClose} title="Delete Account">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
                <Alert severity="error" icon={<Warning fontSize="inherit" />}>
                    <Typography variant="subtitle2" fontWeight="bold">
                        Warning: This action is irreversible!
                    </Typography>
                    <Typography variant="body2">
                        Deleting your account will permanently remove all your data, including medical history, prescriptions, and saved addresses.
                    </Typography>
                </Alert>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    To confirm deletion, please type <strong>{EXPECTED_TEXT}</strong> below:
                </Typography>

                <TextField
                    fullWidth
                    placeholder={EXPECTED_TEXT}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    error={confirmationText.length > 0 && confirmationText !== EXPECTED_TEXT}
                />

                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    fullWidth
                    disabled={confirmationText !== EXPECTED_TEXT}
                    onClick={handleDelete}
                    sx={{ mt: 4, py: 1.5 }}
                >
                    Permanently Delete Account
                </Button>

                <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={onClose}
                >
                    Cancel
                </Button>
            </Box>
        </SidePanel>
    );
};

export default DeleteAccountPanel;
