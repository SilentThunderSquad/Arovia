/**
 * Centralized Logger Service
 * 
 * Environment-aware logging system for development and production.
 * 
 * Development: Logs important events and transitions
 * Production: Logs only errors and critical events
 * 
 * Usage:
 *   logger.debug('event name', { optional metadata })
 *   logger.info('event name', { optional metadata })
 *   logger.warn('event name', { optional metadata })
 *   logger.error('event name', { optional metadata })
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const levels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Production only logs warn and error
const productionMinLevel = levels.WARN;
// Development logs everything
const developmentMinLevel = levels.DEBUG;

const minLevel = isDevelopment ? developmentMinLevel : productionMinLevel;

const formatLog = (level, context, message, metadata = {}) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? `[${context}]` : '';
  const metadataStr = Object.keys(metadata).length > 0 ? JSON.stringify(metadata) : '';
  return `${contextStr} [${timestamp}] ${message} ${metadataStr}`.trim();
};

/**
 * Filters logs based on environment and level
 * Returns true if the log should be displayed
 */
const shouldLog = (level) => level >= minLevel;

const logger = {
  /**
   * Debug level - detailed information for developers
   * Disabled in production
   */
  debug: (message, metadata = {}, context = 'APP') => {
    if (shouldLog(levels.DEBUG)) {
      console.log(`[DEBUG] ${formatLog(levels.DEBUG, context, message, metadata)}`);
    }
  },

  /**
   * Info level - general information
   * Disabled in production
   */
  info: (message, metadata = {}, context = 'APP') => {
    if (shouldLog(levels.INFO)) {
      console.info(`[INFO] ${formatLog(levels.INFO, context, message, metadata)}`);
    }
  },

  /**
   * Warn level - warning messages
   * Enabled in all environments
   */
  warn: (message, metadata = {}, context = 'APP') => {
    if (shouldLog(levels.WARN)) {
      console.warn(`[WARN] ${formatLog(levels.WARN, context, message, metadata)}`);
    }
  },

  /**
   * Error level - error messages
   * Enabled in all environments
   */
  error: (message, metadata = {}, context = 'APP') => {
    if (shouldLog(levels.ERROR)) {
      console.error(`[ERROR] ${formatLog(levels.ERROR, context, message, metadata)}`);
    }
  },

  /**
   * Specialized auth logger
   * Only logs important transitions, not raw activity
   */
  auth: {
    sessionInitStart: () => logger.info('Session initialization started', {}, 'AUTH'),
    sessionInitStarted: () => logger.info('Session initialization started', {}, 'AUTH'),
    sessionInitSuccess: (email, role) => logger.info('Session initialized successfully', { email, role }, 'AUTH'),
    sessionInitFailed: (reason) => logger.error('Session initialization failed', { reason }, 'AUTH'),
    profileFetchRetry: (retriesLeft, delayMs) => logger.debug('Retrying profile fetch', { retriesLeft, delayMs }, 'AUTH'),
    supabaseEventReceived: (event) => logger.debug('Supabase auth event', { event }, 'AUTH'),
    tokenRefreshed: () => logger.debug('Token refreshed', {}, 'AUTH'),
    loginSuccess: (email, role) => logger.info('Login successful', { email, role }, 'AUTH'),
    registrationSuccess: (email) => logger.info('Registration successful', { email }, 'AUTH'),
    oauthSuccess: (role, email) => logger.info('OAuth login successful', { role, email }, 'AUTH'),
    logoutSuccess: () => logger.info('Logout successful', {}, 'AUTH'),
    loginFailed: (reason) => logger.error('Login failed', { reason }, 'AUTH'),
    registrationFailed: (reason) => logger.error('Registration failed', { reason }, 'AUTH'),
    oauthFailed: (reason) => logger.error('OAuth login failed', { reason }, 'AUTH'),
  },

  /**
   * Specialized session logger
   * Only logs important state transitions, not raw activity
   */
  session: {
    trackerInitialized: () => logger.info('Session tracker initialized', {}, 'SESSION'),
    sessionExtended: () => logger.info('Session extended by user', {}, 'SESSION'),
    sessionExpired: () => logger.warn('Session expired due to inactivity', {}, 'SESSION'),
    expirationWarning: (secondsRemaining) => logger.info('Session expiration warning', { secondsRemaining }, 'SESSION'),
    tabRecalibration: () => logger.debug('Tab visibility recalibration', {}, 'SESSION'),
    crossTabMessageReceived: (type) => logger.debug('Cross-tab sync message received', { type }, 'SESSION'),
  },

  /**
   * Specialized activity logger
   * Not used for raw activity - only for important transitions
   */
  activity: {
    activityDetected: () => {
      // Intentionally NOT logged - this would spam console
      // Activity is tracked silently through timer resets
    },
  },
};

export default logger;
