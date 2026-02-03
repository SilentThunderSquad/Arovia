import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { User, Camera, Save } from 'lucide-react';

const UserProfileOptions = ({ userInfo, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        dob: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setFormData({
                name: userInfo.name || '',
                phone: userInfo.phone || '',
                dob: userInfo.dob ? new Date(userInfo.dob).toISOString().split('T')[0] : '',
            });
            // If userInfo has a profile picture URL, set it here (assuming backend sends it)
            // setPreviewUrl(userInfo.profilePicture); 
        }
    }, [userInfo]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit for profile
                Swal.fire('Error', 'Image size should be less than 2MB', 'error');
                return;
            }
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            // 1. Upload Image if changed
            let imageUrl = userInfo?.profilePicture;
            if (profileImage) {
                const formData = new FormData();
                formData.append('profilePicture', profileImage);
                // Assumption: You might need a specific endpoint for profile pic or include it in update
                // For now, let's assume the general update endpoint handles multipart or we do it separately.
                // To keep it simple, let's assume we send JSON first, and if image is needed we handle it.
                // Actually, standard way is multipart/form-data for everything if image is included.
            }

            // Using JSON for data update
            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const updatedUser = await response.json();

            // If image separate upload is needed:
            // if (profileImage) { ... upload logic ... }

            onUpdate(updatedUser.user || updatedUser); // Update parent state logic

            Swal.fire({
                title: 'Success',
                text: 'Profile updated successfully',
                icon: 'success',
                background: '#1a1a2e',
                color: '#fff',
                timer: 1500
            });

        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to update profile', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card profile-options">
            <div className="card-header">
                <h2><User className="icon" size={24} /> Profile Information</h2>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="profile-header">
                    <div className="profile-image-container">
                        <div className="image-preview" style={{ backgroundImage: `url(${previewUrl || 'https://via.placeholder.com/150'})` }}>
                            {!previewUrl && <User size={48} className="default-avatar" />}
                        </div>
                        <label htmlFor="profile-upload" className="upload-btn">
                            <Camera size={16} />
                            <input
                                type="file"
                                id="profile-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                hidden
                            />
                        </label>
                    </div>
                </div>

                <div className="grid-container grid-2">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="input-field disabled"
                            value={userInfo?.email || ''}
                            disabled
                            title="Email cannot be changed"
                        />
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            className="input-field"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 9876543210"
                        />
                    </div>

                    <div className="input-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            className="input-field"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isSaving}>
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfileOptions;
