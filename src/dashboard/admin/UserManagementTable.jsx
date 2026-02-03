import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Search, Filter, Trash2, StopCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const UserManagementTable = ({ users, onUserUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    const filteredUsers = useMemo(() => {
        let result = users || [];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(user =>
                user.name?.toLowerCase().includes(lowerTerm) ||
                user.email?.toLowerCase().includes(lowerTerm)
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter(user => user.role === roleFilter);
        }

        return result;
    }, [users, searchTerm, roleFilter]);

    // Pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete',
            background: '#1a1a2e',
            color: '#fff'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to delete');

                onUserUpdate(); // Refresh parent
                Swal.fire('Deleted!', 'User has been removed.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete user', 'error');
            }
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/admin/users/${user._id}/status`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to update status');

            onUserUpdate(); // Refresh parent
            const action = user.isActive ? 'suspended' : 'activated';
            Swal.fire({
                title: 'Status Updated',
                text: `User has been ${action}.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#fff'
            });
        } catch (error) {
            Swal.fire('Error', 'Failed to update status', 'error');
        }
    };

    return (
        <div className="card user-table-card">
            <div className="table-header">
                <h3>User Management</h3>
                <div className="table-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="filter-box">
                        <Filter size={18} />
                        <select value={roleFilter} onChange={handleRoleFilter}>
                            <option value="all">All Roles</option>
                            <option value="user">User</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map(user => (
                                <tr key={user._id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-small">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${user.role === 'admin' ? 'primary' : user.role === 'doctor' ? 'success' : 'warning'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}></span>
                                        {user.isActive ? 'Active' : 'Suspended'}
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon"
                                                title={user.isActive ? "Suspend" : "Activate"}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {user.isActive ? <StopCircle size={18} color="#f59e0b" /> : <CheckCircle size={18} color="#10b981" />}
                                            </button>
                                            <button
                                                className="btn-icon danger"
                                                title="Delete"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="btn-page"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="page-info">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="btn-page"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default UserManagementTable;
