import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './UserDashboard.css';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load user information',
                icon: 'error',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                Swal.fire({
                    title: 'Invalid File Type',
                    text: 'Please upload a JPG, PNG, or PDF file',
                    icon: 'error',
                    background: '#1a1a2e',
                    color: '#fff'
                });
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    title: 'File Too Large',
                    text: 'File size should not exceed 5MB',
                    icon: 'error',
                    background: '#1a1a2e',
                    color: '#fff'
                });
                return;
            }
            setPrescriptionFile(file);
        }
    };

    const handlePrescriptionUpload = async () => {
        if (!prescriptionFile) {
            Swal.fire({
                title: 'No File Selected',
                text: 'Please select a prescription file to upload',
                icon: 'warning',
                background: '#1a1a2e',
                color: '#fff'
            });
            return;
        }

        setIsUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prescription', prescriptionFile);

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/prescription`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload prescription');
            }

            await response.json();
            
            Swal.fire({
                title: 'Success!',
                text: 'Prescription uploaded successfully',
                icon: 'success',
                background: '#1a1a2e',
                color: '#fff',
                iconColor: '#10b981'
            });

            setPrescriptionFile(null);
            document.getElementById('prescription-input').value = '';
            
            // Refresh user data to show updated prescriptions
            fetchUserData();
        } catch (error) {
            console.error('Error uploading prescription:', error);
            Swal.fire({
                title: 'Upload Failed',
                text: error.message,
                icon: 'error',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="user-dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>User Dashboard</h1>
                    <button onClick={handleLogout} className="btn-logout">
                        Logout
                    </button>
                </div>
            </header>

            <div className="dashboard-content">
                <div className="user-info-section">
                    <h2>Your Information</h2>
                    {userInfo && (
                        <div className="info-card">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{userInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{userInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Role:</span>
                                <span className="info-value">{userInfo.role}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Member Since:</span>
                                <span className="info-value">
                                    {new Date(userInfo.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="prescription-section">
                    <h2>Upload Prescription</h2>
                    <div className="upload-card">
                        <div className="upload-area">
                            <input
                                type="file"
                                id="prescription-input"
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                                className="file-input"
                            />
                            <label htmlFor="prescription-input" className="file-label">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <p>Click to select a file or drag and drop</p>
                                <span className="file-types">Supported: JPG, PNG, PDF (Max 5MB)</span>
                            </label>
                        </div>
                        
                        {prescriptionFile && (
                            <div className="selected-file">
                                <p>Selected: {prescriptionFile.name}</p>
                                <button 
                                    onClick={handlePrescriptionUpload} 
                                    className="btn-upload"
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload Prescription'}
                                </button>
                            </div>
                        )}
                    </div>

                    {userInfo?.prescriptions && userInfo.prescriptions.length > 0 && (
                        <div className="prescriptions-list">
                            <h3>Your Prescriptions</h3>
                            <div className="prescriptions-grid">
                                {userInfo.prescriptions.map((prescription, index) => (
                                    <div key={index} className="prescription-item">
                                        <div className="prescription-icon">📄</div>
                                        <p className="prescription-name">{prescription.filename || `Prescription ${index + 1}`}</p>
                                        <p className="prescription-date">
                                            {new Date(prescription.uploadedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
