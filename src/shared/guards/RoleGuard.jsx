import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@shared/hooks/useAuth';

const RoleGuardContent = ({ children, requiredRole }) => {
  const { role, hasRole } = useAuth();

  if (requiredRole && !hasRole(requiredRole)) {
    // Dynamic fallback to authorized roots
    if (role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      return <Navigate to="/dashboard/user" replace />;
    }
  }

  return children;
};

export const RoleGuard = ({ children, requiredRole }) => {
  return (
    <ProtectedRoute>
      <RoleGuardContent requiredRole={requiredRole}>
        {children}
      </RoleGuardContent>
    </ProtectedRoute>
  );
};

export default RoleGuard;
