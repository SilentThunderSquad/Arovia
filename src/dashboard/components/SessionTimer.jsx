import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Timer, Warning } from '@mui/icons-material';
import Swal from 'sweetalert2';

const SessionTimer = ({ onSessionExpire }) => {
    const SESSION_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
    const WARNING_THRESHOLD = 60 * 1000; // Show warning at 1 minute remaining

    const [timeRemaining, setTimeRemaining] = useState(SESSION_DURATION);
    const [isWarning, setIsWarning] = useState(false);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const resetTimer = useCallback(() => {
        setTimeRemaining(SESSION_DURATION);
        setIsWarning(false);
        localStorage.setItem('sessionStartTime', Date.now().toString());
    }, [SESSION_DURATION]);

    useEffect(() => {
        // Initialize session start time
        const storedStartTime = localStorage.getItem('sessionStartTime');
        if (!storedStartTime) {
            localStorage.setItem('sessionStartTime', Date.now().toString());
        } else {
            // Calculate remaining time based on stored start time
            const elapsed = Date.now() - parseInt(storedStartTime);
            const remaining = SESSION_DURATION - elapsed;

            if (remaining <= 0) {
                // Session already expired
                handleSessionExpire();
                return;
            }
            setTimeRemaining(remaining);
        }

        // Timer countdown
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                const newTime = prev - 1000;

                // Show warning at 1 minute
                if (newTime <= WARNING_THRESHOLD && !isWarning) {
                    setIsWarning(true);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Session Expiring Soon',
                        text: 'Your session will expire in 1 minute. Please save your work.',
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                }

                // Session expired
                if (newTime <= 0) {
                    handleSessionExpire();
                    return 0;
                }

                return newTime;
            });
        }, 1000);

        // Reset timer on user activity
        const resetOnActivity = () => {
            resetTimer();
        };

        // Listen for user activity
        window.addEventListener('mousedown', resetOnActivity);
        window.addEventListener('keydown', resetOnActivity);
        window.addEventListener('scroll', resetOnActivity);
        window.addEventListener('touchstart', resetOnActivity);

        return () => {
            clearInterval(interval);
            window.removeEventListener('mousedown', resetOnActivity);
            window.removeEventListener('keydown', resetOnActivity);
            window.removeEventListener('scroll', resetOnActivity);
            window.removeEventListener('touchstart', resetOnActivity);
        };
    }, [isWarning, resetTimer]);

    const handleSessionExpire = () => {
        localStorage.removeItem('sessionStartTime');

        Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Your session has expired for security reasons. Please login again.',
            confirmButtonText: 'Login',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            onSessionExpire();
        });
    };

    const getTimerColor = () => {
        if (timeRemaining <= WARNING_THRESHOLD) {
            return '#E71D36'; // Red for warning
        }
        if (timeRemaining <= 2 * WARNING_THRESHOLD) {
            return '#FFB703'; // Yellow for caution
        }
        return '#2EC4B6'; // Green for safe
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
                icon={isWarning ? <Warning /> : <Timer />}
                label={formatTime(timeRemaining)}
                size="small"
                sx={{
                    bgcolor: getTimerColor(),
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    animation: isWarning ? 'pulse 1s infinite' : 'none',
                    '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.7 }
                    }
                }}
            />
            <Typography
                variant="caption"
                sx={{
                    color: 'rgba(255,255,255,0.8)',
                    display: { xs: 'none', sm: 'block' }
                }}
            >
                Session
            </Typography>
        </Box>
    );
};

export default SessionTimer;
