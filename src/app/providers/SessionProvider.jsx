import { createContext, useEffect, useRef, useContext, useCallback } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './AuthProvider';

export const SessionContext = createContext(null);

const logEvent = (event, metadata = {}) => {
  console.log(`[SESSION_PROVIDER] [${new Date().toISOString()}] ${event}`, JSON.stringify(metadata));
};

export const SessionProvider = ({ children }) => {
  const { state, logout } = useContext(AuthContext);

  const TIMEOUT_DURATION = 5 * 60 * 1000; // 5 minutes
  const WARNING_DURATION = 1 * 60 * 1000; // 1 minute warning
  const extendDebounceRef = useRef(false);

  const syncChannelRef = useRef(null);
  const warningModalActiveRef = useRef(false);
  const timerIntervalRef = useRef(null);
  const logoutTriggeredRef = useRef(false);

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
   */
  const resetSessionTimer = useCallback((broadcast = true) => {
    if (state !== 'authenticated' || logoutTriggeredRef.current) return;

    const newEndTime = Date.now() + TIMEOUT_DURATION;
    setSessionEndTime(newEndTime);

    if (broadcast && syncChannelRef.current) {
      logEvent('RESET_TIMER_BROADCASTED');
      syncChannelRef.current.postMessage({ type: 'RESET_TIMER', time: newEndTime });
    }
  }, [state, TIMEOUT_DURATION]);

  /**
   * Handle session extend click action with debouncing
   */
  const extendSession = useCallback((broadcast = true) => {
    if (extendDebounceRef.current) return;
    extendDebounceRef.current = true;
    setTimeout(() => { extendDebounceRef.current = false; }, 1000);

    logEvent('SESSION_EXTENDED');
    resetSessionTimer(false); // Update database/local timestamps

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

    logEvent('SESSION_EXPIRED');

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

    logEvent('SHOWING_WARNING_MODAL');

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
        logEvent('MANUAL_INACTIVITY_LOGOUT');
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
      return;
    }

    logEvent('INITIALIZING_SESSION_TRACKER');
    logoutTriggeredRef.current = false;

    // Establish multi-tab broadcast channel
    syncChannelRef.current = new BroadcastChannel('arovia-session-sync');
    syncChannelRef.current.onmessage = (event) => {
      logEvent('CROSS_TAB_MESSAGE_RECEIVED', { type: event.data.type });
      const { type, time } = event.data;

      if (type === 'RESET_TIMER' && time) {
        setSessionEndTime(time);
      } else if (type === 'EXTEND_SESSION') {
        extendSession(false);
      } else if (type === 'LOGOUT') {
        handleSessionExpire(false);
      }
    };

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

    // Global activity listeners
    const handleActivity = () => {
      // Avoid resetting if warning modal is open, to prevent user bypass without clicking extend
      if (warningModalActiveRef.current) return;
      resetSessionTimer(true);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, handleActivity));

    // visibilityState change tracker to recalibrate expired times instantly
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        logEvent('TAB_VISIBLE_RECALIBRATION_START');
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
    };
  }, [state, TIMEOUT_DURATION, WARNING_DURATION, extendSession, triggerWarningModal, handleSessionExpire, resetSessionTimer]);

  return (
    <SessionContext.Provider value={{ extendSession, resetSessionTimer }}>
      {children}
    </SessionContext.Provider>
  );
};
