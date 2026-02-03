import { useState } from 'react';
import Swal from 'sweetalert2';
import { AlertTriangle, Trash } from 'lucide-react';

const DangerZone = () => {
    const handleDeleteAccount = async () => {
        const { value: confirmText } = await Swal.fire({
            title: 'Delete Account?',
            html: `
                <p>This will permanently delete your account and all associated data.</p>
                <p>Type <b>DELETE</b> to confirm.</p>
            `,
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'DELETE',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Permanently Delete',
            background: '#1a1a2e',
            color: '#fff'
        });

        if (confirmText === 'DELETE') {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                const response = await fetch(`${apiUrl}/api/user/delete-account`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to delete account');

                Swal.fire({
                    title: 'Account Deleted',
                    text: 'Your account has been removed. Goodbye.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }, 2000);

            } catch (error) {
                Swal.fire('Error', 'Could not delete account. Please try again.', 'error');
            }
        }
    };

    return (
        <div className="card danger-zone">
            <div className="card-header danger-header">
                <h2><AlertTriangle className="icon" size={24} /> Danger Zone</h2>
            </div>
            <div className="danger-content">
                <div className="danger-item">
                    <div className="danger-info">
                        <h3>Delete Account</h3>
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button onClick={handleDeleteAccount} className="btn btn-danger">
                        <Trash size={16} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DangerZone;
