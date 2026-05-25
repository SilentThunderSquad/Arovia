import { supabase } from '@lib/supabase';
import { api } from '@shared/services/api';

/**
 * Structured log helper for observability
 */
const logEvent = (event, metadata = {}) => {
  console.log(`[AUTH_OBSERVABILITY] [${new Date().toISOString()}] ${event}`, JSON.stringify(metadata));
};

let refreshPromiseLock = null;

const authService = {
  /**
   * Register a standard user credential
   */
  async register({ name, email, password }) {
    logEvent('REGISTER_ATTEMPT', { email });
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      logEvent('REGISTER_SUCCESS', { email });
      return response;
    } catch (error) {
      logEvent('REGISTER_FAILED', { email, error: error.message });
      throw error;
    }
  },

  /**
   * Login standard credential user
   */
  async login(email, password) {
    logEvent('LOGIN_ATTEMPT', { email });
    try {
      const data = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // ✅ role is in context now, NOT in localStorage
      logEvent('LOGIN_SUCCESS', { email, role: data.role });
      return data;
    } catch (error) {
      logEvent('LOGIN_FAILED', { email, error: error.message });
      throw error;
    }
  },

  /**
   * Triggers redirection flow to Google OAuth
   */
  async loginWithGoogle() {
    logEvent('OAUTH_REDIRECT_START', { provider: 'google' });
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      logEvent('OAUTH_REDIRECT_FAILED', { error: error.message });
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
    logEvent('OAUTH_CALLBACK_ATTEMPT');
    
    // Supabase expects token in hash format for getSession() to work
    // If it's in query string, Supabase won't find it
    // Try manual extraction as fallback
    const searchParams = new URLSearchParams(window.location.search);
    const queryAccessToken = searchParams.get('access_token');
    
    if (queryAccessToken && !window.location.hash.includes('access_token')) {
      logEvent('OAUTH_CALLBACK_QUERY_STRING_TOKEN_DETECTED', { hasToken: true });
      // Manually set hash so Supabase getSession() finds it
      window.location.hash = `#access_token=${queryAccessToken}`;
      // Reload to process with hash
      window.location.reload();
      return;
    }

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      logEvent('OAUTH_CALLBACK_FAILED', { error: error?.message || 'No active session' });
      throw new Error('OAuth session not found');
    }

    const accessToken = session.access_token;
    localStorage.setItem('token', accessToken);
    logEvent('OAUTH_CALLBACK_SESSION_ACQUIRED');

    let profileData = null;
    let profileFetchError = null;

    // Try to fetch profile, but don't block OAuth completion if it fails
    try {
      profileData = await api.get('/api/user/profile');
      logEvent('OAUTH_CALLBACK_PROFILE_FETCHED', { role: profileData.role });
    } catch (err) {
      // RESILIENCE: If profile fetch fails, construct minimal profile from OAuth data
      logEvent('OAUTH_CALLBACK_PROFILE_FETCH_FAILED', { error: err.message });
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
      logEvent('OAUTH_CALLBACK_FALLBACK_PROFILE_CREATED', { email: profileData.email });
    }

    // Attempt avatar sync if profile was fetched successfully
    const googleAvatar = session.user?.user_metadata?.avatar_url || session.user?.user_metadata?.picture;
    if (googleAvatar && profileData && !profileFetchError && !profileData.profilePicture) {
      try {
        logEvent('OAUTH_AVATAR_SYNC_START');
        const syncRes = await api.put('/api/user/profile', { profilePictureUrl: googleAvatar });
        if (syncRes?.user) {
          profileData = syncRes.user;
          logEvent('OAUTH_AVATAR_SYNC_SUCCESS');
        }
      } catch (err) {
        logEvent('OAUTH_AVATAR_SYNC_BYPASSED', { error: err.message });
      }
    }

    const role = profileData.role || 'user';
    // ✅ role is in context now, NOT in localStorage
    logEvent('OAUTH_CALLBACK_SUCCESS', { email: profileData.email, role, hadProfileError: !!profileFetchError });
    return { token: accessToken, role, user: profileData };
  },

  /**
   * Refreshes active session token with deduplicated locking
   */
  async refreshSession() {
    if (refreshPromiseLock) {
      logEvent('TOKEN_REFRESH_AWAIT_LOCK');
      return refreshPromiseLock;
    }

    logEvent('TOKEN_REFRESH_START');
    refreshPromiseLock = (async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) throw new Error('No active session to refresh');

        const token = session.access_token;
        localStorage.setItem('token', token);
        logEvent('TOKEN_REFRESH_SUCCESS');
        return session;
      } catch (error) {
        logEvent('TOKEN_REFRESH_FAILED', { error: error.message });
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
    logEvent('LOGOUT_START');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      logEvent('LOGOUT_SUPABASE_SIGNOUT_ERROR', { error: e.message });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logEvent('LOGOUT_SUCCESS');
  },

  isLoggedIn() { return !!localStorage.getItem('token'); },
  getRole() { return localStorage.getItem('role') || 'user'; },
};

export default authService;
