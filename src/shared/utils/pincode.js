/**
 * Fetches location details (State, District/City) from a pincode.
 * USES BACKEND PROXY: GET /api/public/pincode/:pincode
 * 
 * Why backend proxy?
 * - Avoids CORS issues (frontend-to-external-API blocked)
 * - Avoids SSL certificate problems
 * - Better error handling and retry logic on server
 * - Rate limiting protection
 *
 * @param {string} pincode - The 6-digit pincode
 * @returns {Promise<{state: string, city: string, country: string, error?: string}>}
 */
import logger from './logger';

export const fetchLocationByPincode = async (pincode) => {
    // Validate pincode format
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        return { error: 'Invalid pincode. Must be exactly 6 digits.' };
    }
    
    try {
        // Determine backend URL (localhost in dev, production domain in prod)
        const baseURL = window.location.origin.includes('5173') 
            ? 'http://localhost:5000' 
            : window.location.origin;
        
        // Call backend endpoint
        const response = await fetch(`${baseURL}/api/public/pincode/${pincode}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        // Handle rate limiting
        if (response.status === 429) {
            return { error: 'Too many requests. Please wait a moment.' };
        }
        
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        
        const result = await response.json();
        
        // Backend returns { success: true, data: { state, city, country } }
        if (result.success && result.data) {
            logger.debug('Pincode lookup successful via backend', { 
                pincode, 
                state: result.data.state, 
                city: result.data.city 
            }, 'PINCODE');
            
            return {
                state: result.data.state,
                city: result.data.city,
                country: result.data.country || 'India'
            };
        }
        
        return { error: 'Pincode not found. Please enter manually.' };
    } catch (error) {
        logger.warn('Pincode lookup failed', { 
            error: error.message, 
            pincode 
        }, 'PINCODE');
        
        // Provide helpful error message
        if (error.message.includes('Failed to fetch')) {
            return { error: 'Network error. Please check your connection.' };
        }
        
        return { error: 'Could not fetch location. Please enter manually.' };
    }
};
