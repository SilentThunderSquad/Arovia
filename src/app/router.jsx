import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '@features/landing/pages/LandingPage';
import Login from '@features/auth/components/Login';
import Signup from '@features/auth/components/Signup';
import AuthCallback from '@features/auth/components/AuthCallback';
import UserDashboard from '@features/user/components/UserDashboard';
import PublicUserProfile from '@features/user/components/PublicUserProfile';
import AdminDashboard from '@features/admin/components/AdminDashboard';
import AdminProfilePage from '@features/admin/components/AdminProfilePage';
import AdminDoctorProfile from '@features/admin/components/AdminDoctorProfile';
import PublicDoctorProfile from '@features/admin/components/PublicDoctorProfile';

import RoleGuard from '@shared/guards/RoleGuard';
import AuthRedirect from '@shared/guards/AuthRedirect';

// Static/legal pages — lazy-loaded for performance
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const PrivacyPolicy  = lazy(() => import('@pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@pages/TermsOfService'));

const withSuspense = (Component) => (
  <Suspense fallback={<Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress /></Box>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  { path: '/',                                  element: <LandingPage /> },
  { path: '/login',                             element: <AuthRedirect><Login /></AuthRedirect> },
  { path: '/signup',                            element: <AuthRedirect><Signup /></AuthRedirect> },
  { path: '/auth/callback',                     element: <AuthCallback /> },
  { path: '/dashboard/user',                    element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/overview',           element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/prescriptions',      element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/records',            element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/profile',            element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/settings',           element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/dashboard/user/security',           element: <RoleGuard requiredRole="user"><UserDashboard /></RoleGuard> },
  { path: '/u/:username',                       element: <PublicUserProfile /> },
  { path: '/doctor/:username',                  element: <PublicDoctorProfile /> },
  { path: '/dashboard/admin',                   element: <RoleGuard requiredRole="admin"><AdminDashboard /></RoleGuard> },
  { path: '/dashboard/admin/settings',          element: <RoleGuard requiredRole="admin"><AdminDashboard /></RoleGuard> },
  { path: '/dashboard/admin/profile',           element: <RoleGuard requiredRole="admin"><AdminProfilePage /></RoleGuard> },
  { path: '/dashboard/admin/doctor/:doctorName', element: <RoleGuard requiredRole="admin"><AdminDoctorProfile /></RoleGuard> },
  { path: '/privacy-policy',                    element: withSuspense(PrivacyPolicy) },
  { path: '/terms-of-service',                  element: withSuspense(TermsOfService) },
]);
