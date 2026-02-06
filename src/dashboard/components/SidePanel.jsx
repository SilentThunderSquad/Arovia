import { Box, IconButton, Paper, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Close } from '@mui/icons-material';

const SidePanel = ({ isOpen, onClose, title, children, width = '45%' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        sx={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(0, 0, 0, 0.3)',
                            zIndex: 1200,
                            backdropFilter: 'blur(3px)',
                        }}
                    />

                    {/* Panel */}
                    <Paper
                        component={motion.div}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        elevation={6}
                        sx={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: { xs: '100%', md: width }, // Responsive width
                            zIndex: 1201,
                            bgcolor: 'rgba(255, 255, 255, 0.85)', // Slight transparency
                            backdropFilter: 'blur(12px)', // Glassmorphism
                            borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                    >
                        {/* Header */}
                        <Box sx={{
                            p: 3,
                            borderBottom: '1px solid rgba(0,0,0,0.08)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            bgcolor: '#0F4C5C', // Brand Primary
                            color: 'white',
                            position: 'sticky',
                            top: 0,
                            zIndex: 10
                        }}>
                            <Typography variant="h5" fontWeight="bold">
                                {title}
                            </Typography>
                            <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                                <Close />
                            </IconButton>
                        </Box>

                        {/* Content */}
                        <Box sx={{ p: 3, flexGrow: 1 }}>
                            {children}
                        </Box>
                    </Paper>
                </>
            )}
        </AnimatePresence>
    );
};

export default SidePanel;
