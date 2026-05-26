/**
 * Throttle Utility
 * 
 * Prevents a function from being called more than once within a specified time window.
 * 
 * Example:
 *   const throttledFn = throttle(() => console.log('called'), 1000);
 *   
 *   throttledFn(); // Executes immediately
 *   throttledFn(); // Ignored (within 1000ms)
 *   throttledFn(); // Ignored (within 1000ms)
 *   // After 1000ms:
 *   throttledFn(); // Executes again
 */

export const throttle = (func, limit) => {
  let inThrottle;
  let lastRan;

  return (...args) => {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(inThrottle);
      inThrottle = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

/**
 * Debounce Utility
 * 
 * Delays function execution until after a specified time has elapsed without new calls.
 * 
 * Example:
 *   const debouncedFn = debounce(() => console.log('called'), 500);
 *   
 *   debouncedFn(); // Timer starts
 *   debouncedFn(); // Timer resets
 *   debouncedFn(); // Timer resets
 *   // After 500ms without calls:
 *   // Executes once
 */

export const debounce = (func, wait) => {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

/**
 * Activity Throttler with Callback
 * 
 * Intelligent throttling that supports:
 * - Immediate execution on first call
 * - Throttled execution within time window
 * - Final execution after activity stops
 * 
 * Example:
 *   const tracker = new ActivityThrottler(30000); // 30 second window
 *   
 *   window.addEventListener('mousemove', () => {
 *     tracker.track(() => {
 *       // This fires on first activity
 *       // Then only once every 30 seconds
 *     });
 *   });
 */

export class ActivityThrottler {
  constructor(throttleWindow = 30000) {
    this.throttleWindow = throttleWindow;
    this.lastExecutionTime = 0;
    this.pendingExecution = false;
    this.timeoutId = null;
  }

  track(callback) {
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecutionTime;

    if (timeSinceLastExecution >= this.throttleWindow) {
      // Enough time has passed, execute immediately
      callback();
      this.lastExecutionTime = now;
      this.pendingExecution = false;

      // Clear any pending execution
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
    } else {
      // Within throttle window
      if (!this.pendingExecution) {
        this.pendingExecution = true;

        // Schedule execution at the end of throttle window
        this.timeoutId = setTimeout(() => {
          callback();
          this.lastExecutionTime = Date.now();
          this.pendingExecution = false;
          this.timeoutId = null;
        }, this.throttleWindow - timeSinceLastExecution);
      }
      // else: Already pending, do nothing (ignored)
    }
  }

  reset() {
    this.lastExecutionTime = 0;
    this.pendingExecution = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  destroy() {
    this.reset();
  }
}
