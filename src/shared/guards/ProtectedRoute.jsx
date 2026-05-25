import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';

/**
 * ProtectedRoute — Guards private routes (dashboards, settings, etc.)
 * 
 * ARCHITECTURE GUARANTEE:
 *   By the time this component renders, the AppBootstrapGate has ALREADY
 *   resolved auth state to a terminal value. Therefore:
 * 
 *   - `state` is ALWAYS 'authenticated' or 'unauthenticated' (never 'idle'/'loading')
 *   - No loading spinners needed during initial hydration
 *   - No race conditions possible
 * 
 * If authenticated → render protected content immediately
 * If unauthenticated → redirect to /login with return URL preserved
 * 
 * NOTE: We still show a loading state for post-bootstrap transitions
 *       (e.g., token refresh), but this is rare and brief.
 */
export const ProtectedRoute = ({ children }) => {
  const { state, loading } = useAuth();
  const location = useLocation();

  // Handle post-bootstrap loading (e.g., token refresh mid-session)
  // This only triggers AFTER the initial bootstrap has completed
  if (loading && state === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        gap: '1rem',
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #0F4C5C',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{
          color: '#6b7280',
          fontWeight: 500,
          fontSize: '0.875rem',
          letterSpacing: '0.05em',
          fontFamily: "'Inter', sans-serif",
        }}>
          VERIFYING SESSION...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not authenticated → redirect to login with return URL
  if (state !== 'authenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated → render protected content
  return children;
};

export default ProtectedRoute;
