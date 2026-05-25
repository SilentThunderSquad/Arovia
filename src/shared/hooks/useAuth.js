import { useContext } from 'react';
import { AuthContext } from '@app/providers/AuthProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { role, state } = context;

  // Consolidated from useRole hook
  const isUser = state === 'authenticated' && role === 'user';
  const isAdmin = state === 'authenticated' && role === 'admin';
  const isDoctor = state === 'authenticated' && role === 'doctor';

  const hasRole = (targetRole) => {
    if (state !== 'authenticated') return false;
    return role === targetRole;
  };

  return {
    ...context,
    isUser,
    isAdmin,
    isDoctor,
    hasRole,
  };
};

export default useAuth;
