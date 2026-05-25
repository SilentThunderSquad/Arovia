import { useEffect, useState } from 'react';

import { Box, Chip, Typography } from '@mui/material';
import { Timer, Warning } from '@mui/icons-material';

const SessionTimer = () => {
  const [timeRemaining, setTimeRemaining] = useState(300000); // 5 minutes default fallback
  const [isWarning, setIsWarning] = useState(false);

  const formatTime = (ms) => {
    const total = Math.ceil(ms / 1000);
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Pure UI Ticker: just pulls absolute timestamp from central session manager
    const interval = setInterval(() => {
      const storedEndTime = localStorage.getItem('session_end_time');
      if (!storedEndTime) return;

      const remaining = parseInt(storedEndTime, 10) - Date.now();
      const clampedRemaining = Math.max(0, remaining);
      
      setTimeRemaining(clampedRemaining);
      setIsWarning(clampedRemaining <= 60000); // Highlight red if under 1 minute
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getTimerColor = () => (isWarning ? '#E71D36' : '#2EC4B6');

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
            '50%': { opacity: 0.7 },
          },
        }}
      />
      <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.5)', display: { xs: 'none', sm: 'block' }, fontWeight: 500 }}>
        Session
      </Typography>
    </Box>
  );
};

export default SessionTimer;
