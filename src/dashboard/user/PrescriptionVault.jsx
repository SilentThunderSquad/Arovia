import { useState } from 'react';
import Swal from 'sweetalert2';
import { FileText, Upload, Trash2, Eye } from 'lucide-react';

const PrescriptionVault = ({ userInfo, onUpdate }) => {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            if (!validTypes.includes(selectedFile.type)) {
                Swal.fire('Invalid File', 'Please upload JPG, PNG or PDF', 'error');
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                Swal.fire('File Too Large', 'Max file size is 5MB', 'error');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prescription', file);

            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/user/prescription`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const updatedUser = await response.json();
            onUpdate(updatedUser.user || updatedUser); // Assuming API returns updated user object

            Swal.fire({
                title: 'Uploaded!',
                text: 'Prescription added to vault.',
                icon: 'success',
                timer: 1500,
                background: '#1a1a2e',
                color: '#fff'
            });
            setFile(null);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to upload prescription', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (prescriptionId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            background: '#1a1a2e',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                // Assuming DELETE endpoint exists or using a generic update
                // For now, let's assume a DELETE endpoint like /api/user/prescription/:id
                const response = await fetch(`${apiUrl}/api/user/prescription/${prescriptionId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Delete failed');

                // We need to manually remove it from local state or refetch. 
                // Ideally API returns updated list or user.
                const updatedUser = await response.json();
                onUpdate(updatedUser.user || updatedUser);

                Swal.fire('Deleted!', 'Prescription has been deleted.', 'success');
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'Failed to delete prescription', 'error');
            }
        }
    };

    return (
        <div className="card prescription-vault">
            <div className="card-header">
                <h2><FileText className="icon" size={24} /> Prescription Vault</h2>
            </div>

            <div className="upload-section">
                <div className="upload-box">
                    <input
                        type="file"
                        id="prescription-upload"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="file-input-hidden"
                    />
                    <label htmlFor="prescription-upload" className="upload-label">
                        <Upload size={32} className="upload-icon" />
                        <span>{file ? file.name : 'Click to select or drag PDF/Image'}</span>
                        <span className="upload-hint">Max 5MB</span>
                    </label>
                </div>
                {file && (
                    <button
                        onClick={handleUpload}
                        className="btn btn-primary btn-upload-action"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Upload to Vault'}
                    </button>
                )}
            </div>

            <div className="prescriptions-grid-container">
                <h3>Your Documents</h3>
                {userInfo?.prescriptions?.length === 0 ? (
                    <p className="no-docs">No prescriptions uploaded yet.</p>
                ) : (
                    <div className="grid-container grid-3">
                        {userInfo?.prescriptions?.map((doc, idx) => (
                            <div key={doc._id || idx} className="doc-card">
                                <div className="doc-preview">
                                    {doc.filename?.endsWith('.pdf') ? (
                                        <FileText size={40} className="pdf-icon" />
                                    ) : (
                                        <img src={doc.path || 'placeholder.jpg'} alt="Preview" className="img-preview" />
                                    )}
                                </div>
                                <div className="doc-info">
                                    <p className="doc-name" title={doc.originalName}>{doc.originalName || doc.filename}</p>
                                    <span className="doc-date">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="doc-actions">
                                    <button className="btn-icon" onClick={() => window.open(doc.path, '_blank')}>
                                        <Eye size={16} />
                                    </button>
                                    <button className="btn-icon danger" onClick={() => handleDelete(doc._id)}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionVault;
