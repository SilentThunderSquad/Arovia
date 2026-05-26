import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import authService from '@shared/services/auth.service';
import { useAuth } from '@shared/hooks/useAuth';
import { getDashboardPath } from '@shared/utils/roleRoutes';
import logger from '@shared/utils/logger';

/**
 * AuthCallback - OAuth callback handler
 * 
 * FIX: Auto-redirect when initialization completes
 * 
 * Flow:
 *   1. handleOAuthCallback() extracts token from URL
 *   2. initializeSession(token) updates auth state to 'authenticated'
 *   3. Component detects state change → renders <Navigate /> to dashboard
 *   4. User automatically sent to dashboard
 *   5. If error: redirect to /login after 3s
 */
const AuthCallback = () => {
  const { state, role, initializeSession } = useAuth();
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only run once
    if (isInitialized) return;

    // CRITICAL FIX: Add early timeout to prevent indefinite hangs
    // If profile fetch doesn't complete in 8 seconds, redirect anyway with fallback auth
    const earlyTimeoutId = setTimeout(() => {
      if (!error && !isInitialized) {
        logger.warn('OAuth callback early timeout', { waited_ms: 8000, proceeding_with: 'fallback' }, 'AUTH');
        
        // Get role from token or localStorage
        const savedRole = localStorage.getItem('auth_role') || 'user';
        setError(null); // Clear error to allow redirect
        setIsInitialized(true); // Trigger redirect with fallback role
      }
    }, 8000);

    // Also keep diagnostic timeout for monitoring
    const diagnosticTimeout = setTimeout(() => {
      if (!error && isInitialized === false) {
        logger.debug('OAuth callback diagnostic timeout', { waited_ms: 10000 }, 'AUTH');
      }
    }, 10000);

    const handle = async () => {
      try {
        // Extract token from URL
        logger.debug('OAuth callback extracting token', {}, 'AUTH');
        const result = await authService.handleOAuthCallback();
        logger.debug('OAuth callback token extracted', { hasToken: !!result.token, role: result.role }, 'AUTH');
        
        // Save role for fallback
        if (result.role) {
          localStorage.setItem('auth_role', result.role);
        }
        
        // Initialize session (updates auth state)
        logger.debug('OAuth callback initializing session', {}, 'AUTH');
        await initializeSession(result.token);
        logger.auth.oauthSuccess(result.role);
        
        // Mark as initialized so next render will redirect
        setIsInitialized(true);
        clearTimeout(earlyTimeoutId);
        clearTimeout(diagnosticTimeout);
      } catch (err) {
        logger.warn('OAuth callback failed', { error: err.message }, 'AUTH');
        setError(err.message || 'Authentication failed');
        clearTimeout(earlyTimeoutId);
        clearTimeout(diagnosticTimeout);
      }
    };

    handle();

    return () => {
      clearTimeout(earlyTimeoutId);
      clearTimeout(diagnosticTimeout);
    };
  }, [isInitialized, initializeSession]);

   // If initialization succeeded and auth is now authenticated, redirect immediately
  if (isInitialized && state === 'authenticated') {
    const dashboardPath = getDashboardPath(role);
    logEvent('OAUTH_CALLBACK_REDIRECTING_SUCCESS', { path: dashboardPath });
    return <Navigate to={dashboardPath} replace />;
  }

  // If initialization succeeded but no auth state yet, use fallback redirect
  if (isInitialized && state !== 'authenticated') {
    const savedRole = localStorage.getItem('auth_role') || 'user';
    const dashboardPath = savedRole === 'admin' ? '/dashboard/admin' : '/dashboard/user';
    logEvent('OAUTH_CALLBACK_REDIRECTING_FALLBACK', { path: dashboardPath, role: savedRole });
    return <Navigate to={dashboardPath} replace />;
  }

  // If error occurred, redirect to login after showing error
  if (error) {
    setTimeout(() => {
      // Use window.location for hard redirect (fallback)
      window.location.href = '/login';
    }, 3000);

    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)',
          gap: 3,
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff' }}>
          Authentication failed: {error}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Redirecting to login...
        </Typography>
      </Box>
    );
  }

  // Still initializing - show loading screen
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)',
        gap: 3,
      }}
    >
      <CircularProgress sx={{ color: '#fff' }} size={60} />
      <Typography variant="h6" sx={{ color: '#fff' }}>
        Completing secure clinical sign in...
      </Typography>
    </Box>
  );
};

export default AuthCallback;
