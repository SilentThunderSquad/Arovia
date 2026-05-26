/**
 * Fetches location details (State, District/City) from a pincode.
 * Uses the free public API: https://api.postalpincode.in/pincode/{pincode}
 * Falls back to alternative API if primary fails.
 *
 * @param {string} pincode - The 6-digit pincode
 * @returns {Promise<{state: string, city: string, error?: string}>}
 */
import logger from './logger';

export const fetchLocationByPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) return { error: 'Invalid pincode length' };
    
    // Try primary API
    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            return { state: postOffice.State, city: postOffice.District, country: 'India' };
        }
        return { error: 'Invalid pincode or not found' };
    } catch (error) {
        logger.warn('Primary pincode API failed', { error: error.message, pincode }, 'PINCODE');
        
        // Try fallback API (pincode.in)
        try {
            const fallbackResponse = await fetch(`https://pincode.in/api/v2/pincode/${pincode}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                if (fallbackData.success && fallbackData.data && fallbackData.data[0]) {
                    const location = fallbackData.data[0];
                    return { 
                        state: location.state_name, 
                        city: location.district_name, 
                        country: 'India' 
                    };
                }
            }
        } catch (fallbackError) {
            logger.warn('Fallback pincode API also failed', { error: fallbackError.message, pincode }, 'PINCODE');
        }
        
        return { error: 'Failed to fetch location data. Please enter manually.' };
    }
};
