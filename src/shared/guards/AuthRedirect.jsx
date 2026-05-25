import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { getDashboardPath } from '@shared/utils/roleRoutes';

/**
 * AuthRedirect — Guards public auth routes (/login, /signup)
 * 
 * ARCHITECTURE GUARANTEE:
 *   By the time this component renders, the AppBootstrapGate has ALREADY
 *   resolved auth state to a terminal value. The router only mounts after
 *   bootstrap completes. Therefore:
 * 
 *   - `state` is ALWAYS 'authenticated' or 'unauthenticated' (never 'idle'/'loading')
 *   - No spinners needed
 *   - No loading checks needed
 *   - No race conditions possible
 * 
 * If authenticated → instant redirect to dashboard (0ms, no flash)
 * If unauthenticated → render auth page immediately
 * 
 * React context is the single source of truth for auth state.
 * localStorage is NOT used for auth state checks (eliminated in Phase 3).
 */
export const AuthRedirect = ({ children }) => {
  const { state, role } = useAuth();
  const location = useLocation();

  // Auth is GUARANTEED to be resolved here (bootstrap gate ensures this)
  if (state === 'authenticated') {
    // Determine destination: saved "from" location or role-based dashboard
    const savedPath = location.state?.from?.pathname;
    const roleDashboard = getDashboardPath(role);
    const destination = savedPath || roleDashboard;
    return <Navigate to={destination} replace />;
  }

  // User is genuinely unauthenticated — render the auth page
  return children;
};

export default AuthRedirect;
