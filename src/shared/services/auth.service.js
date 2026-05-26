import { supabase } from '@lib/supabase';
import { api } from '@shared/services/api';
import logger from '@shared/utils/logger';

let refreshPromiseLock = null;

const authService = {
  /**
   * Register a standard user credential
   */
  async register({ name, email, password }) {
    logger.debug('Register attempt', { email }, 'AUTH');
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      logger.auth.registrationSuccess(email);
      return response;
    } catch (error) {
      logger.warn('Registration failed', { email, error: error.message }, 'AUTH');
      throw error;
    }
  },

  /**
   * Login standard credential user
   */
  async login(email, password) {
    logger.debug('Login attempt', { email }, 'AUTH');
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // ✅ role is in context now, NOT in localStorage
      logger.auth.loginSuccess(email, data.role);
      return data;
    } catch (error) {
      logger.warn('Login failed', { email, error: error.message }, 'AUTH');
      throw error;
    }
  },

  /**
   * Triggers redirection flow to Google OAuth
   */
  async loginWithGoogle() {
    logger.debug('OAuth redirect start', { provider: 'google' }, 'AUTH');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      logger.warn('OAuth redirect failed', { error: error.message }, 'AUTH');
      throw new Error(error.message);
    }
  },

  /**
   * Resolves raw session payload from Supabase redirect
   * 
   * RESILIENCE: If profile fetch fails, still proceed with minimal OAuth data
   * The dashboard can fetch full profile later as a non-blocking operation
   * 
   * SAFETY: Handles both hash and query string OAuth redirect formats
   */
  async handleOAuthCallback() {
    logger.debug('OAuth callback attempt', {}, 'AUTH');
    
    // Supabase expects token in hash format for getSession() to work
    // If it's in query string, Supabase won't find it
    // Try manual extraction as fallback
    const searchParams = new URLSearchParams(window.location.search);
    const queryAccessToken = searchParams.get('access_token');
    
    if (queryAccessToken && !window.location.hash.includes('access_token')) {
      logger.debug('OAuth query string token detected', { hasToken: true }, 'AUTH');
      // Manually set hash so Supabase getSession() finds it
      window.location.hash = `#access_token=${queryAccessToken}`;
      // Reload to process with hash
      window.location.reload();
      return;
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      logger.warn('OAuth callback failed', { error: error?.message || 'No active session' }, 'AUTH');
      throw new Error('OAuth session not found');
    }

    const accessToken = session.access_token;
    localStorage.setItem('token', accessToken);
    logger.debug('OAuth session acquired', {}, 'AUTH');

    let profileData = null;
    let profileFetchError = null;

    // Try to fetch profile, but don't block OAuth completion if it fails
    try {
      profileData = await api.get('/api/user/profile');
      logger.debug('OAuth profile fetched', { role: profileData.role }, 'AUTH');
    } catch (err) {
      // RESILIENCE: If profile fetch fails, construct minimal profile from OAuth data
      logger.debug('OAuth profile fetch failed', { error: err.message }, 'AUTH');
      profileFetchError = err;
      
      // Fallback: use OAuth user data to construct minimal profile
      profileData = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || session.user.email.split('@')[0],
        username: session.user.email.split('@')[0],
        role: 'user', // Default role for new OAuth users
        profilePicture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
        profilePictureUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
      };
      logger.debug('OAuth fallback profile created', { email: profileData.email }, 'AUTH');
    }

    // Attempt avatar sync if profile was fetched successfully
    const googleAvatar = session.user?.user_metadata?.avatar_url || session.user?.user_metadata?.picture;
    if (googleAvatar && profileData && !profileFetchError && !profileData.profilePicture) {
      try {
        logger.debug('OAuth avatar sync start', {}, 'AUTH');
        const syncRes = await api.put('/api/user/profile', { profilePictureUrl: googleAvatar });
        if (syncRes?.user) {
          profileData = syncRes.user;
          logger.debug('OAuth avatar sync success', {}, 'AUTH');
        }
      } catch (err) {
        logger.debug('OAuth avatar sync bypassed', { error: err.message }, 'AUTH');
      }
    }

    const role = profileData.role || 'user';
    // ✅ role is in context now, NOT in localStorage
    logger.auth.oauthSuccess(role, profileData.email);
    return { token: accessToken, role, user: profileData };
  },

  /**
   * Refreshes active session token with deduplicated locking
   */
  async refreshSession() {
    if (refreshPromiseLock) {
      logger.debug('Token refresh await lock', {}, 'AUTH');
      return refreshPromiseLock;
    }

    logger.debug('Token refresh start', {}, 'AUTH');
    refreshPromiseLock = (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) throw new Error('No active session to refresh');

        const token = session.access_token;
        localStorage.setItem('token', token);
        logger.debug('Token refresh success', {}, 'AUTH');
        return session;
      } catch (error) {
        logger.warn('Token refresh failed', { error: error.message }, 'AUTH');
        throw error;
      } finally {
        refreshPromiseLock = null;
      }
    })();

    return refreshPromiseLock;
  },

  /**
   * Log out active user completely
   */
  async logout() {
    logger.debug('Logout start', {}, 'AUTH');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      logger.debug('Logout Supabase signout error', { error: e.message }, 'AUTH');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logger.auth.logoutSuccess();
  },

  isLoggedIn() { return !!localStorage.getItem('token'); },
  getRole() { return localStorage.getItem('role') || 'user'; },
};

export default authService;
