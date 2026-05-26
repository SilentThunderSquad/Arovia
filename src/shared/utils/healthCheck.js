/**
 * Health Check Utility
 * 
 * Verifies backend API is available before attempting OAuth or critical operations
 */

import logger from './logger';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const HEALTH_CHECK_TIMEOUT = 3000; // 3 seconds

export const checkBackendHealth = async (verbose = false) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), HEALTH_CHECK_TIMEOUT);

    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (verbose) {
      logger.debug('Backend health check passed', { status: response.status }, 'HEALTH');
    }
    
    return response.ok;
  } catch (error) {
    if (verbose) {
      logger.warn('Backend health check failed', {
        error: error.message,
        backend: BACKEND_URL,
      }, 'HEALTH');
    }
    return false;
  }
};

/**
 * Show error dialog when backend is unavailable
 */
export const showBackendUnavailableError = async () => {
  const Swal = (await import('sweetalert2')).default;
  
  return Swal.fire({
    title: 'Backend Service Unavailable',
    html: `
      <p style="margin-bottom: 10px;">The application backend is not running.</p>
      <p style="margin-bottom: 10px;">Please start the backend server:</p>
      <code style="background: #f0f0f0; padding: 10px; border-radius: 4px; display: block; margin: 10px 0;">
        npm run dev:backend
      </code>
      <p style="font-size: 12px; color: #666; margin-top: 10px;">Then refresh this page.</p>
    `,
    icon: 'error',
    confirmButtonColor: '#0F4C5C',
    allowOutsideClick: false,
    allowEscapeKey: false,
  });
};

/**
 * Wrapper for OAuth redirects that checks backend first
 */
export const safeOAuthRedirect = async (redirectFn) => {
  const isHealthy = await checkBackendHealth(true);
  
  if (!isHealthy) {
    await showBackendUnavailableError();
    return false;
  }
  
  // Backend is healthy, proceed with redirect
  redirectFn();
  return true;
};
