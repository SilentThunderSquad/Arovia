import { useState } from 'react';
import Swal from 'sweetalert2';
import { Lock, Heart, Shield } from 'lucide-react';

const SecuritySettings = ({ userInfo, onUpdate }) => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [isUpdatingWait, setIsUpdatingWait] = useState(false);
    const [bloodDonorStatus, setBloodDonorStatus] = useState(userInfo?.bloodDonor || false);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitPasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return Swal.fire('Error', 'New passwords do not match', 'error');
        }
        if (passwords.new.length < 8) {
            return Swal.fire('Error', 'Password must be at least 8 characters', 'error');
        }

        setIsUpdatingWait(true);
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to change password');

            Swal.fire('Success', 'Password changed successfully', 'success');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        } finally {
            setIsUpdatingWait(false);
        }
    };

    const toggleBloodDonor = async () => {
        try {
            const newValue = !bloodDonorStatus;

            if (newValue) {
                const result = await Swal.fire({
                    title: 'Become a Blood Donor?',
                    text: 'By agreeing, you consent to be contacted for blood donation emergencies.',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, I Agree',
                    background: '#1a1a2e',
                    color: '#fff'
                });
                if (!result.isConfirmed) return;
            }

            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bloodDonor: newValue }),
            });

            if (!response.ok) throw new Error('Failed to update status');

            setBloodDonorStatus(newValue);
            if (userInfo) userInfo.bloodDonor = newValue; // Optimistic update

            Swal.fire({
                title: newValue ? 'Thank You!' : 'Status Updated',
                text: newValue ? 'You are now a registered blood donor.' : 'You have opted out of blood donation.',
                icon: 'success',
                timer: 1500
            });

        } catch (error) {
            Swal.fire('Error', 'Failed to update blood donor status', 'error');
        }
    };

    return (
        <div className="security-grid">
            <div className="card security-card">
                <div className="card-header">
                    <h2><Shield className="icon" size={24} /> Security</h2>
                </div>
                <form onSubmit={submitPasswordChange} className="password-form">
                    <div className="input-group">
                        <label>Current Password</label>
                        <input
                            type="password"
                            name="current"
                            className="input-field"
                            value={passwords.current}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            name="new"
                            className="input-field"
                            value={passwords.new}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirm"
                            className="input-field"
                            value={passwords.confirm}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatingWait}>
                        <Lock size={16} /> Update Password
                    </button>
                </form>
            </div>

            <div className={`card donation-card ${bloodDonorStatus ? 'active' : ''}`}>
                <div className="card-header">
                    <h2><Heart className="icon" size={24} /> Blood Donation</h2>
                </div>
                <div className="donation-content">
                    <p>Help save lives by registering as a blood donor. You'll only be contacted in emergencies.</p>
                    <div className="toggle-container">
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={bloodDonorStatus}
                                onChange={toggleBloodDonor}
                            />
                            <span className="slider round"></span>
                        </label>
                        <span className="status-label">
                            {bloodDonorStatus ? 'I am a Donor' : 'Not a Donor'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySettings;
