import { useState } from 'react';

import { Avatar, Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close, CloudUpload, Delete, Description, PictureAsPdf, Visibility } from '@mui/icons-material';

import Swal from 'sweetalert2';

import userService from '@features/user/services/userService';

const PrescriptionVault = ({ userInfo, onUpdate }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // Document viewer states
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(selectedFile.type)) {
            return Swal.fire({ title: 'Invalid File', text: 'Please upload JPG, PNG or PDF', icon: 'error', background: '#ffffff', color: '#111827' });
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            return Swal.fire({ title: 'File Too Large', text: 'Max file size is 5MB', icon: 'error', background: '#ffffff', color: '#111827' });
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('prescription', file);
            const data = await userService.uploadPrescription(formData);
            if (onUpdate) {
                const profile = await userService.getProfile();
                onUpdate(profile);
            }
            Swal.fire({ title: 'Uploaded!', text: 'Prescription added to vault.', icon: 'success', timer: 1500, showConfirmButton: false, background: '#ffffff', color: '#111827', iconColor: '#2EC4B6' });
            setFile(null);
        } catch (error) {
            const errorMessage = error.message?.includes('401') 
                ? 'Your session has expired. Please login again.'
                : error.message?.includes('413')
                ? 'File is too large. Maximum 5MB allowed.'
                : 'Failed to upload prescription. Please try again.';
            Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', background: '#ffffff', color: '#111827' });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (prescriptionId) => {
        const result = await Swal.fire({ title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#6b7280', confirmButtonText: 'Yes, delete it!', background: '#ffffff', color: '#111827' });

        if (result.isConfirmed) {
            try {
                await userService.deletePrescription(prescriptionId);
                if (onUpdate) {
                    const profile = await userService.getProfile();
                    onUpdate(profile);
                }
                Swal.fire({ title: 'Deleted!', text: 'Prescription has been deleted.', icon: 'success', background: '#ffffff', color: '#111827', iconColor: '#2EC4B6' });
            } catch (error) {
                const errorMessage = error.message?.includes('401')
                    ? 'Your session has expired. Please login again.'
                    : 'Failed to delete prescription. Please try again.';
                Swal.fire({ title: 'Error', text: errorMessage, icon: 'error', background: '#ffffff', color: '#111827' });
            }
        }
    };

    const handleViewDocument = (doc) => {
        setSelectedDoc(doc);
        setViewerOpen(true);
    };

    return (
        <>
            <Card sx={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <Description sx={{ mr: 1, color: '#0F4C5C', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F4C5C' }}>Prescription Vault</Typography>
                    </Box>

                    {/* Upload Section */}
                    <Box sx={{ border: '2px dashed #e5e7eb', borderRadius: 2, p: 4, textAlign: 'center', mb: 3, backgroundColor: '#F8F9FA', transition: 'all 0.3s', '&:hover': { borderColor: '#2EC4B6', backgroundColor: '#f0fdf4' } }}>
                        <input type="file" id="prescription-upload" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" style={{ display: 'none' }} />
                        <label htmlFor="prescription-upload" style={{ cursor: 'pointer' }}>
                            <CloudUpload sx={{ fontSize: 48, color: '#2EC4B6', mb: 2 }} />
                            <Typography variant="body1" sx={{ mb: 1, color: '#111827' }}>{file ? file.name : 'Click to select or drag PDF/Image'}</Typography>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>Max 5MB • JPG, PNG, PDF</Typography>
                        </label>
                    </Box>

                    {file && (
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                            <Button variant="contained" startIcon={<CloudUpload />} onClick={handleUpload} disabled={isUploading} sx={{ px: 4 }}>
                                {isUploading ? 'Uploading...' : 'Upload to Vault'}
                            </Button>
                        </Box>
                    )}

                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>Your Documents</Typography>

                    {!userInfo?.prescriptions || userInfo.prescriptions.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>No prescriptions uploaded yet.</Typography>
                        </Box>
                    ) : (
                        <List>
                            {userInfo.prescriptions.map((doc, idx) => (
                                <ListItem key={doc._id || idx} sx={{ border: '1px solid #e5e7eb', borderRadius: 2, mb: 1, '&:hover': { bgcolor: '#F8F9FA' } }}
                                    secondaryAction={
                                        <Box>
                                            <IconButton edge="end" onClick={() => handleViewDocument(doc)} sx={{ color: '#2EC4B6', mr: 1 }}><Visibility /></IconButton>
                                            <IconButton edge="end" onClick={() => handleDelete(doc._id)} sx={{ color: '#ef4444' }}><Delete /></IconButton>
                                        </Box>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#0F4C5C' }}>
                                            {doc.filename?.toLowerCase().endsWith('.pdf') ? <PictureAsPdf /> : <Description />}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={doc.originalName || doc.filename} secondary={new Date(doc.uploadedAt).toLocaleDateString()} primaryTypographyProps={{ fontWeight: 500 }} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            {/* Document Viewer Dialog */}
            <Dialog
                open={viewerOpen}
                onClose={() => setViewerOpen(false)}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: isMobile ? 0 : 3,
                        overflow: 'hidden',
                        height: isMobile ? '100%' : '80vh',
                        bgcolor: '#FFFFFF',
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#0F4C5C', color: '#FFFFFF' }}>
                    <Typography component="span" variant="h6" fontWeight="700" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                        {selectedDoc?.originalName || selectedDoc?.filename || 'Document Viewer'}
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={() => setViewerOpen(false)}
                        sx={{
                            color: '#FFFFFF',
                            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0, bgcolor: '#F8F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>
                    {selectedDoc && (
                        selectedDoc.path?.toLowerCase().endsWith('.pdf') || selectedDoc.filename?.toLowerCase().endsWith('.pdf') ? (
                            <Box component="iframe" src={selectedDoc.path} width="100%" height="100%" sx={{ border: 'none', minHeight: isMobile ? 'calc(100% - 56px)' : '100%' }} title="PDF Document Viewer" />
                        ) : (
                            <Box sx={{ p: 2, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                                <Box component="img" src={selectedDoc.path} alt={selectedDoc.originalName || selectedDoc.filename} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 1.5, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                            </Box>
                        )
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, display: 'flex', justifyContent: 'space-between', bgcolor: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight="500">
                        Uploaded on: {selectedDoc ? new Date(selectedDoc.uploadedAt).toLocaleDateString() : ''}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Button
                            variant="outlined"
                            onClick={() => window.open(selectedDoc?.path, '_blank')}
                            startIcon={<Visibility sx={{ fontSize: 18 }} />}
                            sx={{
                                color: '#0F4C5C',
                                borderColor: '#0F4C5C',
                                '&:hover': { borderColor: '#2EC4B6', color: '#2EC4B6', bgcolor: 'transparent' },
                                textTransform: 'none',
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        >
                            Open in New Tab
                        </Button>
                        <Button
                            variant="contained"
                            onClick={() => setViewerOpen(false)}
                            sx={{
                                bgcolor: '#0F4C5C',
                                color: '#FFFFFF',
                                '&:hover': { bgcolor: '#2EC4B6' },
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 4,
                                borderRadius: 2
                            }}
                        >
                            Close
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PrescriptionVault;

