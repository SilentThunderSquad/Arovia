import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@lib/supabase';
import { api } from '@shared/services/api';
import authService from '@shared/services/auth.service';

export const AuthContext = createContext(null);

const logEvent = (event, metadata = {}) => {
  console.log(`[AUTH_PROVIDER] [${new Date().toISOString()}] ${event}`, JSON.stringify(metadata));
};

/**
 * AuthProvider — Single Source of Truth for Authentication State
 * 
 * State Machine:
 *   idle → loading → authenticated | unauthenticated | error
 * 
 * CRITICAL ARCHITECTURE RULE:
 *   The AppBootstrapGate blocks ALL route rendering until this provider
 *   reaches a TERMINAL state (authenticated | unauthenticated | error).
 *   This means login/signup pages NEVER mount during hydration.
 * 
 * The `bootstrapResolved` flag is derived from state and indicates
 * whether the initial auth check has completed.
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    state: 'idle', // 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'
    user: null,
    profile: null,
    role: null,
    loading: true,
    errorMsg: null,
  });

  const initializedRef = useRef(false);
  const initPromiseRef = useRef(null);
  const authStateRef = useRef(authState);

  /**
   * Helper to fetch profiles with progressive exponential backoff retries
   */
  const fetchProfileWithRetry = async (retries = 3, delay = 1000) => {
    try {
      return await api.get('/api/user/profile');
    } catch (err) {
      if (retries > 0) {
        logEvent('PROFILE_FETCH_RETRY', { retriesLeft: retries, nextDelayMs: delay });
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchProfileWithRetry(retries - 1, delay * 2);
      }
      throw err;
    }
  };

  /**
   * Centralized session initialization lifecycle
   * 
   * This is the ONLY place where auth state transitions happen
   * (besides logout and Supabase SIGNED_OUT events).
   * 
   * Flow:
   *   1. Check for token (explicit, Supabase session, or localStorage)
   *   2. If no token → unauthenticated (terminal)
   *   3. If token → fetch profile → authenticated (terminal)
   *   4. If fetch fails → error/unauthenticated (terminal)
   *   5. Failsafe: 7s timeout → unauthenticated (terminal)
   */
  const initializeSession = useCallback(async (explicitToken = null) => {
    // Concurrency lock: if initialization is already running, await the existing promise
    if (initPromiseRef.current) {
      logEvent('INITIALIZE_SESSION_CONCURRENCY_LOCKED');
      return initPromiseRef.current;
    }

    const runInit = async () => {
      logEvent('INITIALIZE_SESSION_START');
      setAuthState((prev) => ({ ...prev, state: 'loading', loading: true, errorMsg: null }));

      // Failsafe: force terminal state if hydration hangs for 20 seconds
      // (7s was too aggressive for slow networks; 3x retry with backoff + 5s buffer)
      const failsafeTimeout = setTimeout(() => {
        logEvent('INITIALIZE_SESSION_FAILSAFE_TRIGGERED');
        setAuthState({
          state: 'unauthenticated',
          user: null,
          profile: null,
          role: null,
          loading: false,
          errorMsg: 'Verification timed out. Please refresh and try again.',
        });
      }, 20000);

      try {
        // Step 1: Get current Supabase session
        let activeSession = null;
        try {
          const { data: { session } } = await supabase.auth.getSession();
          activeSession = session;
        } catch (err) {
          logEvent('SESSION_RETRIEVAL_WARNING', { error: err.message });
        }

        const token = explicitToken || activeSession?.access_token || localStorage.getItem('token');

        // Step 2: No token → unauthenticated (terminal state)
        if (!token) {
          logEvent('INITIALIZE_SESSION_NO_TOKEN');
          clearTimeout(failsafeTimeout);
          localStorage.removeItem('token');
          // ✅ role not in localStorage anymore
          setAuthState({
            state: 'unauthenticated',
            user: null,
            profile: null,
            role: null,
            loading: false,
            errorMsg: null,
          });
          return;
        }

        // Step 4: Save token for API headers ONLY (context is source of truth)
        localStorage.setItem('token', token);

        // Step 4: Fetch user profile with retries
        logEvent('PROFILE_FETCH_START');
        const profile = await fetchProfileWithRetry();
        const role = profile.role || 'user';
        // ✅ token kept in localStorage for API headers
        // ✅ role stored in context (React is source of truth)
        // ✅ NO localStorage write for role

        // Step 5: Authenticated (terminal state)
        clearTimeout(failsafeTimeout);
        setAuthState({
          state: 'authenticated',
          user: activeSession?.user || { email: profile.email, id: profile.id },
          profile,
          role,
          loading: false,
          errorMsg: null,
        });

        logEvent('INITIALIZE_SESSION_SUCCESS', { email: profile.email, role });
      } catch (error) {
        // Step 6: Error → degrade to unauthenticated (terminal state)
        logEvent('INITIALIZE_SESSION_FAILED', { error: error.message });
        clearTimeout(failsafeTimeout);
        localStorage.removeItem('token');
        // ✅ role not in localStorage anymore
        setAuthState({
          state: 'unauthenticated',
          user: null,
          profile: null,
          role: null,
          loading: false,
          errorMsg: error.message || 'Verification failed. Please login again.',
        });
      }
    };

    initPromiseRef.current = runInit();
    try {
      return await initPromiseRef.current;
    } finally {
      initPromiseRef.current = null;
    }
  }, []);

  /**
   * Manual credentials login
   */
  const login = async (email, password) => {
    logEvent('MANUAL_LOGIN_START', { email });
    setAuthState((prev) => ({ ...prev, state: 'loading', loading: true }));
    try {
      const data = await authService.login(email, password);
      await initializeSession(data.token);
      logEvent('MANUAL_LOGIN_SUCCESS', { email, role: data.role });
      return data;
    } catch (error) {
      logEvent('MANUAL_LOGIN_FAILED', { email, error: error.message });
      setAuthState((prev) => ({
        ...prev,
        state: 'unauthenticated',
        loading: false,
        errorMsg: error.message,
      }));
      throw error;
    }
  };

  /**
   * Manual credentials registration
   */
  const register = async ({ name, email, password }) => {
    logEvent('MANUAL_REGISTER_START', { email });
    try {
      const data = await authService.register({ name, email, password });
      logEvent('MANUAL_REGISTER_SUCCESS', { email });
      return data;
    } catch (error) {
      logEvent('MANUAL_REGISTER_FAILED', { email, error: error.message });
      throw error;
    }
  };

  /**
   * Manual logout — clears all auth state and storage synchronously
   */
  const logout = useCallback(async () => {
    logEvent('MANUAL_LOGOUT_START');
    // Clear storage FIRST before any async work
    localStorage.removeItem('token');
    // ✅ NO localStorage.removeItem('role') - role is in context now
    localStorage.removeItem('session_end_time');
    // Set state immediately
    setAuthState({
      state: 'unauthenticated',
      user: null,
      profile: null,
      role: null,
      loading: false,
      errorMsg: null,
    });
    // Then do async Supabase cleanup (non-blocking)
    try {
      await authService.logout();
    } catch (err) {
      logEvent('MANUAL_LOGOUT_CLEANUP_WARNING', { error: err.message });
    }
    logEvent('MANUAL_LOGOUT_SUCCESS');
  }, []);

  useEffect(() => {
    // Initialize session exactly once (StrictMode-safe)
    if (!initializedRef.current) {
      initializedRef.current = true;
      initializeSession();
    }

    // Subscribe to Supabase auth events
    // NOTE: On initial mount, Supabase might fire SIGNED_IN/SIGNED_OUT event
    // But we already called initializeSession() above, so skip those initial events
    let isInitialEvent = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      logEvent('SUPABASE_AUTH_EVENT_RECEIVED', { event, isInitialEvent });
      
      // Skip initial Supabase event - we already ran initializeSession()
      if (isInitialEvent) {
        isInitialEvent = false;
        return;
      }

      // Prevent redundant initialization if already authenticated
      // (Supabase fires SIGNED_IN on tab visibility changes, which would cause loops)
      if (event === 'SIGNED_IN' && authStateRef.current?.state === 'authenticated') {
        logEvent('SUPABASE_SIGNED_IN_SKIPPED_ALREADY_AUTHENTICATED');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          await initializeSession(session.access_token);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('token');
        // ✅ NO localStorage.removeItem('role')
        setAuthState({
          state: 'unauthenticated',
          user: null,
          profile: null,
          role: null,
          loading: false,
          errorMsg: null,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeSession]);

  /**
   * Keep authStateRef synchronized with authState for use in callbacks
   * This allows the Supabase listener to check the current auth state
   * without creating stale closures
   */
  useEffect(() => {
    authStateRef.current = authState;
  }, [authState]);

  /**
   * Update profile locally (used after field updates to avoid full re-fetch)
   * TODO: Optimize dashboards to use targeted API calls + this method
   * instead of calling initializeSession() on every change
   */
  const updateProfile = useCallback((updates) => {
    setAuthState(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout, initializeSession, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
