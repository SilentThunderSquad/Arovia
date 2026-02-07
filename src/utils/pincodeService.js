/**
 * Fetches location details (State, District/City) from a pincode.
 * Uses the free public API: https://api.postalpincode.in/pincode/{pincode}
 * 
 * @param {string} pincode - The 6-digit pincode
 * @returns {Promise<{state: string, city: string, error?: string}>}
 */
export const fetchLocationByPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
        return { error: 'Invalid pincode length' };
    }

    try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0 && data[0].Status === 'Success') {
            const postOffice = data[0].PostOffice[0];
            return {
                state: postOffice.State,
                city: postOffice.District, // Using District as City usually maps better for general addressing
                country: 'India'
            };
        } else {
            return { error: 'Invalid pincode or not found' };
        }
    } catch (error) {
        console.error('Error fetching pincode details:', error);
        return { error: 'Failed to fetch location data' };
    }
};
