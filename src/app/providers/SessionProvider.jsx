import { createContext, useEffect, useRef, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthProvider';
import logger from '@shared/utils/logger';
import { ActivityThrottler } from '@shared/utils/throttle';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const { state, logout } = useContext(AuthContext);

  const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
  const WARNING_DURATION = 1 * 60 * 1000; // 1 minute warning
  const extendDebounceRef = useRef(false);

  const syncChannelRef = useRef(null);
  const warningModalActiveRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const logoutTriggeredRef = useRef(false);
  const activityThrottlerRef = useRef(null);
  const initializeRef = useRef(false);

  // Tracks the absolute timestamp when the session should expire
  const getSessionEndTime = () => {
    const val = localStorage.getItem('session_end_time');
    return val ? parseInt(val, 10) : Date.now() + TIMEOUT_DURATION;
  };

  const setSessionEndTime = (time) => {
    localStorage.setItem('session_end_time', time.toString());
  };

  /**
   * Reset session timer duration across active events
   * 
   * Architecture:
   * - Local timer reset: happens instantly (client-side only)
   * - Broadcast: throttled to max once per 30 seconds (cross-tab sync)
   * 
   * This prevents event storms while keeping session responsive
   */
  const resetSessionTimer = useCallback((broadcast = true) => {
    if (state !== 'authenticated' || logoutTriggeredRef.current) return;

    const newEndTime = Date.now() + TIMEOUT_DURATION;
    setSessionEndTime(newEndTime);

    // Only broadcast if explicitly requested AND within throttle window
    if (broadcast && syncChannelRef.current && activityThrottlerRef.current) {
      activityThrottlerRef.current.track(() => {
        logger.session.sessionExtended();
        syncChannelRef.current.postMessage({ type: 'RESET_TIMER', time: newEndTime });
      });
    }
  }, [state, TIMEOUT_DURATION]);

  /**
   * Handle session extend click action with debouncing
   */
  const extendSession = useCallback((broadcast = true) => {
    if (extendDebounceRef.current) return;
    extendDebounceRef.current = true;
    setTimeout(() => { extendDebounceRef.current = false; }, 1000);

    logger.session.sessionExtended();
    resetSessionTimer(false);

    // Close any active SweetAlert warnings safely
    if (warningModalActiveRef.current) {
      Swal.close();
      warningModalActiveRef.current = false;
    }

    if (broadcast && syncChannelRef.current) {
      syncChannelRef.current.postMessage({ type: 'EXTEND_SESSION' });
    }
  }, [resetSessionTimer]);

  /**
   * Handle global expired auto logouts
   */
  const handleSessionExpire = useCallback(async (broadcast = true) => {
    if (logoutTriggeredRef.current) return;
    logoutTriggeredRef.current = true;

    logger.session.sessionExpired();

    if (warningModalActiveRef.current) {
      Swal.close();
      warningModalActiveRef.current = false;
    }

    if (broadcast && syncChannelRef.current) {
      syncChannelRef.current.postMessage({ type: 'LOGOUT' });
    }

    localStorage.removeItem('session_end_time');

    // Trigger sweetalert notifying expiration and log out
    await Swal.fire({
      icon: 'warning',
      title: 'Session Expired',
      text: 'You have been logged out due to inactivity to protect your account details.',
      confirmButtonText: 'Re-authenticate',
      confirmButtonColor: '#0F4C5C',
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    await logout();
  }, [logout]);

  /**
   * Trigger Warning Modal
   */
  const triggerWarningModal = useCallback(() => {
    if (warningModalActiveRef.current || logoutTriggeredRef.current) return;
    warningModalActiveRef.current = true;

    logger.session.expirationWarning(Math.floor((getSessionEndTime() - Date.now()) / 1000));

    let timerInterval;
    Swal.fire({
      title: 'Session Inactivity Warning',
      html: 'Your session will expire in <strong></strong> seconds due to inactivity.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Extend Session',
      cancelButtonText: 'Logout Now',
      confirmButtonColor: '#2EC4B6',
      cancelButtonColor: '#ef4444',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        const b = Swal.getHtmlContainer().querySelector('strong');
        timerInterval = setInterval(() => {
          const remaining = Math.max(0, Math.floor((getSessionEndTime() - Date.now()) / 1000));
          if (b) b.textContent = remaining.toString();
          if (remaining <= 0) {
            clearInterval(timerInterval);
            handleSessionExpire(true);
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      warningModalActiveRef.current = false;
      if (result.isConfirmed) {
        extendSession(true);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        logger.info('Manual inactivity logout', {}, 'SESSION');
        handleSessionExpire(true);
      }
    });
  }, [extendSession, handleSessionExpire]);

  useEffect(() => {
    if (state !== 'authenticated') {
      // Clear timers and listeners if unauthenticated
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (syncChannelRef.current) {
        syncChannelRef.current.close();
        syncChannelRef.current = null;
      }
      logoutTriggeredRef.current = false;
      initializeRef.current = false;
      return;
    }

    // CRITICAL: Guard against React StrictMode double-mounts and duplicate subscriptions
    if (initializeRef.current) return;
    initializeRef.current = true;

    // Initialize activity throttler: batches activity into single broadcast per 30 seconds
    activityThrottlerRef.current = new ActivityThrottler(30000);

    logger.session.sessionInitSuccess();

    // Establish multi-tab broadcast channel
    try {
      syncChannelRef.current = new BroadcastChannel('arovia-session-sync');
      syncChannelRef.current.onmessage = (event) => {
        logger.debug('Cross-tab message', { type: event.data.type }, 'SESSION');
        const { type, time } = event.data;

        if (type === 'RESET_TIMER' && time) {
          setSessionEndTime(time);
        } else if (type === 'EXTEND_SESSION') {
          extendSession(false);
        } else if (type === 'LOGOUT') {
          handleSessionExpire(false);
        }
      };
    } catch (err) {
      logger.warn('BroadcastChannel unavailable', { error: err.message }, 'SESSION');
    }

    // Initialize/sync ending timestamps
    const now = Date.now();
    const storedEnd = localStorage.getItem('session_end_time');
    if (!storedEnd || parseInt(storedEnd, 10) <= now) {
      setSessionEndTime(now + TIMEOUT_DURATION);
    }

    // Interval ticker managing state polling
    timerIntervalRef.current = setInterval(() => {
      // Check visibility state to throttle loops
      if (document.visibilityState === 'hidden') {
        return; // Pause countdown ticks while hidden
      }

      const currentEnd = getSessionEndTime();
      const remaining = currentEnd - Date.now();

      if (remaining <= 0) {
        clearInterval(timerIntervalRef.current);
        handleSessionExpire(true);
      } else if (remaining <= WARNING_DURATION && !warningModalActiveRef.current) {
        triggerWarningModal();
      }
    }, 1000);

    // Global activity listeners - throttled to prevent event storms
    const handleActivity = () => {
      // Avoid resetting if warning modal is open, to prevent user bypass without clicking extend
      if (warningModalActiveRef.current) return;
      
      // Reset locally ALWAYS for responsiveness
      // But only broadcast once per 30 seconds (via activityThrottlerRef)
      resetSessionTimer(true);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, handleActivity, { passive: true }));

    // visibilityState change tracker to recalibrate expired times instantly
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        logger.debug('Tab visible, recalibrating session', {}, 'SESSION');
        const end = getSessionEndTime();
        const rem = end - Date.now();
        if (rem <= 0) {
          handleSessionExpire(true);
        } else if (rem <= WARNING_DURATION && !warningModalActiveRef.current) {
          triggerWarningModal();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (syncChannelRef.current) {
        syncChannelRef.current.close();
        syncChannelRef.current = null;
      }
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Reset initialization guard
      initializeRef.current = false;
    };
  }, [state, TIMEOUT_DURATION, WARNING_DURATION, extendSession, triggerWarningModal, handleSessionExpire, resetSessionTimer]);

  return (
    <SessionContext.Provider value={{ extendSession, resetSessionTimer }}>
      {children}
    </SessionContext.Provider>
  );
};
