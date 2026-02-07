import { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
} from '@mui/material';
import {
    Description,
    CloudUpload,
    Delete,
    Visibility,
    PictureAsPdf,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const PrescriptionVault = ({ userInfo, onUpdate }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(selectedFile.type)) {
                Swal.fire({
                    title: 'Invalid File',
                    text: 'Please upload JPG, PNG or PDF',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: 'File Too Large',
                    text: 'Max file size is 5MB',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prescription', file);

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/prescription`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const updatedUser = await response.json();
            onUpdate(updatedUser.user || updatedUser);

            Swal.fire({
                title: 'Uploaded!',
                text: 'Prescription added to vault.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#ffffff',
                color: '#111827',
                iconColor: '#2EC4B6',
            });
            setFile(null);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to upload prescription',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (prescriptionId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            color: '#111827',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                const response = await fetch(`${apiUrl}/api/user/prescription/${prescriptionId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Delete failed');

                const updatedUser = await response.json();
                onUpdate(updatedUser.user || updatedUser);

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Prescription has been deleted.',
                    icon: 'success',
                    background: '#ffffff',
                    color: '#111827',
                    iconColor: '#2EC4B6',
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete prescription',
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
                border: '1px solid #e5e7eb',
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Description sx={{ mr: 1, color: '#0F4C5C', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>
                        Prescription Vault
                    </Typography>
                </Box>

                {/* Upload Section */}
                <Box
                    sx={{
                        border: '2px dashed #e5e7eb',
                        borderRadius: 2,
                        p: 4,
                        textAlign: 'center',
                        mb: 3,
                        backgroundColor: '#F8F9FA',
                        transition: 'all 0.3s',
                        '&:hover': {
                            borderColor: '#2EC4B6',
                            backgroundColor: '#f0fdf4',
                        },
                    }}
                >
                    <input
                        type="file"
                        id="prescription-upload"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="prescription-upload" style={{ cursor: 'pointer' }}>
                        <CloudUpload sx={{ fontSize: 48, color: '#2EC4B6', mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 1, color: '#111827' }}>
                            {file ? file.name : 'Click to select or drag PDF/Image'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            Max 5MB • JPG, PNG, PDF
                        </Typography>
                    </label>
                </Box>

                {file && (
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<CloudUpload />}
                            onClick={handleUpload}
                            disabled={isUploading}
                            sx={{ px: 4 }}
                        >
                            {isUploading ? 'Uploading...' : 'Upload to Vault'}
                        </Button>
                    </Box>
                )}

                {/* Documents List */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
                    Your Documents
                </Typography>

                {!userInfo?.prescriptions || userInfo.prescriptions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            No prescriptions uploaded yet.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {userInfo.prescriptions.map((doc, idx) => (
                            <ListItem
                                key={doc._id || idx}
                                sx={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 2,
                                    mb: 1,
                                    '&:hover': { bgcolor: '#F8F9FA' },
                                }}
                                secondaryAction={
                                    <Box>
                                        <IconButton
                                            edge="end"
                                            onClick={() => window.open(doc.path, '_blank')}
                                            sx={{ color: '#2EC4B6', mr: 1 }}
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            edge="end"
                                            onClick={() => handleDelete(doc._id)}
                                            sx={{ color: '#ef4444' }}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </Box>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#0F4C5C' }}>
                                        {doc.filename?.endsWith('.pdf') ? <PictureAsPdf /> : <Description />}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={doc.originalName || doc.filename}
                                    secondary={new Date(doc.uploadedAt).toLocaleDateString()}
                                    primaryTypographyProps={{ fontWeight: 500 }}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default PrescriptionVault;
