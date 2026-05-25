/** Application route constants — single source of truth */
export const ROUTES = {
  HOME:            '/',
  LOGIN:           '/login',
  SIGNUP:          '/signup',
  AUTH_CALLBACK:   '/auth/callback',

  USER_DASHBOARD:  '/dashboard/user',
  USER_PROFILE:    '/dashboard/:username',

  ADMIN_DASHBOARD: '/dashboard/admin',
  ADMIN_PROFILE:   '/dashboard/admin/profile',
  ADMIN_DOCTOR:    '/dashboard/admin/doctor/:doctorName',

  PRIVACY_POLICY:  '/privacy-policy',
  TERMS:           '/terms-of-service',
};
