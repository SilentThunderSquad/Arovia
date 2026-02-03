import { createTheme } from '@mui/material/styles';

// Custom theme for Arovia - Matching Landing Page Color Scheme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0F4C5C', // Primary Blue from landing page
            light: '#1a6b7f',
            dark: '#0a3540',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#2EC4B6', // Secondary Teal from landing page
            light: '#4dd4c7',
            dark: '#25a89c',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#FFB703', // Accent Amber from landing page
            light: '#ffc733',
            dark: '#e6a500',
        },
        info: {
            main: '#0F4C5C',
            light: '#1a6b7f',
            dark: '#0a3540',
        },
        success: {
            main: '#2EC4B6',
            light: '#4dd4c7',
            dark: '#25a89c',
        },
        background: {
            default: '#F8F9FA',
            paper: '#ffffff',
        },
        text: {
            primary: '#111827',
            secondary: '#6b7280',
        },
    },
    typography: {
        fontFamily: '"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            fontFamily: '"Poppins", sans-serif',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            fontFamily: '"Poppins", sans-serif',
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: '"Poppins", sans-serif',
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
            fontFamily: '"Poppins", sans-serif',
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.5,
            fontFamily: '"Poppins", sans-serif',
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
            fontFamily: '"Poppins", sans-serif',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: '"Poppins", sans-serif',
        },
    },
    shape: {
        borderRadius: 12,
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '0 2px 4px rgba(15,76,92,0.1)',
        '0 4px 8px rgba(15,76,92,0.12)',
        '0 8px 16px rgba(15,76,92,0.14)',
        '0 12px 24px rgba(15,76,92,0.16)',
        '0 2px 4px rgba(46,196,182,0.1)',
        '0 4px 8px rgba(46,196,182,0.12)',
        '0 8px 16px rgba(46,196,182,0.14)',
        '0 12px 24px rgba(46,196,182,0.16)',
        '0 16px 32px rgba(46,196,182,0.18)',
        '0 20px 40px rgba(46,196,182,0.2)',
        '0 24px 48px rgba(46,196,182,0.22)',
        '0 28px 56px rgba(46,196,182,0.24)',
        '0 32px 64px rgba(46,196,182,0.26)',
        '0 36px 72px rgba(46,196,182,0.28)',
        '0 40px 80px rgba(46,196,182,0.3)',
        '0 44px 88px rgba(46,196,182,0.32)',
        '0 48px 96px rgba(46,196,182,0.34)',
        '0 52px 104px rgba(46,196,182,0.36)',
        '0 56px 112px rgba(46,196,182,0.38)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 9999, // Full rounded like landing page
                    padding: '12px 32px',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                    },
                },
                contained: {
                    background: '#FFB703', // Amber accent from landing page
                    color: '#ffffff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    '&:hover': {
                        background: '#e6a500',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(255, 183, 3, 0.4)',
                    },
                },
                outlined: {
                    borderWidth: '2px',
                    '&:hover': {
                        borderWidth: '2px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 12,
                        backgroundColor: '#ffffff',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        },
                        '&.Mui-focused': {
                            boxShadow: '0 0 0 3px rgba(46, 196, 182, 0.2)',
                        },
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                },
            },
        },
    },
});

export default theme;
