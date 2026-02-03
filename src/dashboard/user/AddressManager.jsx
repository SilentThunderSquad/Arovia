import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { MapPin, Search, Save } from 'lucide-react';

const AddressManager = ({ userInfo, onUpdate }) => {
    const [address, setAddress] = useState({
        country: 'India',
        state: '',
        pincode: '',
        city: '',
        addressLine1: '',
        addressLine2: '',
        landmark: ''
    });
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userInfo && userInfo.address) {
            setAddress(prev => ({ ...prev, ...userInfo.address }));
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));

        // Auto-trigger pincode search if 6 digits
        if (name === 'pincode' && value.length === 6) {
            lookupPincode(value);
        }
    };

    const lookupPincode = async (pincode) => {
        setIsSearching(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data && data[0].Status === 'Success') {
                const details = data[0].PostOffice[0];
                setAddress(prev => ({
                    ...prev,
                    city: details.District,
                    state: details.State,
                    country: 'India'
                }));
            } else {
                // Silent fail or small toast
                console.log('Invalid pincode');
            }
        } catch (error) {
            console.error('Pincode lookup failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/address`, { // Assuming new endpoint
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ address }),
            });

            if (!response.ok) throw new Error('Failed to update address');

            const updatedUser = await response.json();
            onUpdate(updatedUser.user || updatedUser);

            Swal.fire({
                title: 'Success',
                text: 'Address updated successfully',
                icon: 'success',
                background: '#1a1a2e',
                color: '#fff',
                timer: 1500
            });
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update address', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card address-manager">
            <div className="card-header">
                <h2><MapPin className="icon" size={24} /> Address Management</h2>
            </div>

            <form onSubmit={handleSubmit} className="address-form">
                <div className="grid-container grid-2">
                    <div className="input-group">
                        <label>Country</label>
                        <select
                            name="country"
                            className="input-field"
                            value={address.country}
                            onChange={handleChange}
                        >
                            <option value="India">India</option>
                            {/* Add other countries if needed */}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Pincode</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                name="pincode"
                                className="input-field"
                                value={address.pincode}
                                onChange={handleChange}
                                maxLength={6}
                                placeholder="Enter 6-digit pincode"
                                required
                            />
                            {isSearching && (
                                <span style={{ position: 'absolute', right: '10px', top: '10px' }}>
                                    <div className="spinner-small"></div>
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>State</label>
                        <input
                            type="text"
                            name="state"
                            className="input-field"
                            value={address.state}
                            readOnly
                            placeholder="Auto-filled"
                        />
                    </div>

                    <div className="input-group">
                        <label>City / District</label>
                        <input
                            type="text"
                            name="city"
                            className="input-field"
                            value={address.city}
                            readOnly
                            placeholder="Auto-filled"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <label>Address Line 1</label>
                    <input
                        type="text"
                        name="addressLine1"
                        className="input-field"
                        value={address.addressLine1}
                        onChange={handleChange}
                        placeholder="House No., Building, Street"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        name="addressLine2"
                        className="input-field"
                        value={address.addressLine2}
                        onChange={handleChange}
                        placeholder="Apartment, Studio, Floor"
                    />
                </div>

                <div className="input-group">
                    <label>Landmark (Optional)</label>
                    <input
                        type="text"
                        name="landmark"
                        className="input-field"
                        value={address.landmark}
                        onChange={handleChange}
                        placeholder="Near Famous Place"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressManager;
