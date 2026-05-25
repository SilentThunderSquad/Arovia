import { useAuth } from '@shared/hooks/useAuth';
import { getDashboardPath } from '@shared/utils/roleRoutes';
import { Box, Typography } from '@mui/material';

/**
 * AppBootstrapGate
 * 
 * This is the SINGLE authority that decides whether the application
 * router is allowed to mount. It sits between AuthProvider and RouterProvider.
 * 
 * Architecture:
 *   AuthProvider → AppBootstrapGate → RouterProvider
 * 
 * The router (and therefore ALL routes including /login, /signup) will
 * NEVER render until auth state has fully resolved to a terminal state.
 * 
 * Terminal states: 'authenticated' | 'unauthenticated' | 'error'
 * Blocked states:  'idle' | 'loading' | 'refreshing'
 * 
 * This completely eliminates:
 *   - Auth page flickering for logged-in users
 *   - Route rendering before auth resolution
 *   - Hydration race conditions
 *   - Spinner loops on auth pages
 *   - Back-button auth page flashes
 */

const TERMINAL_STATES = new Set(['authenticated', 'unauthenticated', 'error']);

const AppBootstrapGate = ({ children }) => {
  const { state } = useAuth();

  // CRITICAL: /auth/callback must ALWAYS render immediately
  // It handles OAuth token from URL and initializes session
  // If we block it, OAuth redirects will show 404
  // Use window.location.pathname directly (not useLocation hook which needs Router context)
  const isOAuthCallback = window.location.pathname === '/auth/callback';
  if (isOAuthCallback) {
    return children;
  }

  // Block router rendering until auth state resolves to a terminal state
  if (!TERMINAL_STATES.has(state)) {
    return <BootstrapScreen />;
  }

  // Auth resolved — mount the router and all routes
  return children;
};

/**
 * BootstrapScreen
 * 
 * A premium, branded loading screen shown ONLY during initial app bootstrap.
 * This is NOT an auth page — it's the app startup screen.
 * Users see this for <1 second on cold start while session validates.
 * 
 * Design: Matches Arovia's medical premium aesthetic with the
 * gradient background, pulsing logo, and subtle loading indicator.
 */
const BootstrapScreen = () => (
  <Box
    sx={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F4C5C 0%, #1a6b7f 40%, #2EC4B6 100%)',
      gap: 3,
    }}
  >
    {/* Pulsing Logo */}
    <Box
      sx={{
        fontSize: '3.5rem',
        animation: 'pulse 2s ease-in-out infinite',
        filter: 'drop-shadow(0 4px 20px rgba(255,255,255,0.3))',
      }}
    >
      🏥
    </Box>

    {/* Brand Name */}
    <Typography
      variant="h4"
      sx={{
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        background: 'linear-gradient(135deg, #ffffff 0%, #FFB703 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '0.02em',
      }}
    >
      Arovia
    </Typography>

    {/* Minimal Loading Bar */}
    <Box
      sx={{
        width: 120,
        height: 3,
        borderRadius: 2,
        background: 'rgba(255,255,255,0.15)',
        overflow: 'hidden',
        mt: 1,
      }}
    >
      <Box
        sx={{
          width: '40%',
          height: '100%',
          borderRadius: 2,
          background: 'linear-gradient(90deg, #FFB703, #ffffff)',
          animation: 'bootstrapSlide 1.2s ease-in-out infinite',
          '@keyframes bootstrapSlide': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(350%)' },
          },
        }}
      />
    </Box>
  </Box>
);

export default AppBootstrapGate;
