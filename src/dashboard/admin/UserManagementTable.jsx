import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    IconButton,
    Chip,
    Avatar,
    Typography,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    Delete,
    Block,
    CheckCircle,
    Visibility,
    Edit
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const UserManagementTable = ({ users, doctors, onUserUpdate }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('users');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredData = useMemo(() => {
        let result = [];

        if (activeTab === 'doctors') {
            result = doctors || [];
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                result = result.filter(
                    (doc) =>
                        doc.Name?.toLowerCase().includes(lowerTerm) ||
                        doc.Specialization?.toLowerCase().includes(lowerTerm)
                );
            }
        } else {
            result = users || [];
            const roleMatch = activeTab === 'admins' ? 'admin' : 'user';
            result = result.filter((user) => user.role === roleMatch);
            
            if (searchTerm) {
                const lowerTerm = searchTerm.toLowerCase();
                result = result.filter(
                    (user) =>
                        user.name?.toLowerCase().includes(lowerTerm) ||
                        user.email?.toLowerCase().includes(lowerTerm)
                );
            }
        }

        return result;
    }, [users, doctors, searchTerm, activeTab]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(0);
    };

    const handleDelete = async (id, isDoctor = false) => {
        const result = await Swal.fire({
            title: isDoctor ? 'Delete Doctor?' : 'Delete User?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete',
            background: '#ffffff',
            color: '#111827',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const origin = window.location.origin;
                const apiUrl =
                    window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

                const endpoint = isDoctor ? `/api/admin/doctors/${id}` : `/api/admin/users/${id}`;
                const response = await fetch(`${apiUrl}${endpoint}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to delete');

                onUserUpdate();
                Swal.fire({
                    title: 'Deleted!',
                    text: isDoctor ? 'Doctor has been removed.' : 'User has been removed.',
                    icon: 'success',
                    background: '#ffffff',
                    color: '#111827',
                    iconColor: '#2EC4B6',
                });
            } catch (error) {
                console.error('Error deleting:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete',
                    icon: 'error',
                    background: '#ffffff',
                    color: '#111827',
                });
            }
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl =
                window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;

            const response = await fetch(`${apiUrl}/api/admin/users/${user._id}/status`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to update status');

            onUserUpdate();
            const action = user.isActive ? 'suspended' : 'activated';
            Swal.fire({
                title: 'Status Updated',
                text: `User has been ${action}.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#ffffff',
                color: '#111827',
                iconColor: '#2EC4B6',
            });
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to update status',
                icon: 'error',
                background: '#ffffff',
                color: '#111827',
            });
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return '#0F4C5C';
            case 'doctor':
                return '#2EC4B6';
            default:
                return '#FFB703';
        }
    };

    const getDoctorUrlName = (name) => {
        if (!name) return '';
        // remove spaces, dots, and prefixes like Dr. (or just spaces according to user instructions)
        return name.replace(/\s+/g, '').replace('Dr.', '').replace('Dr', '');
    };

    return (
        <Card sx={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0F4C5C' }}>
                        User Management
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            size="small"
                            sx={{ flexGrow: { xs: 1, md: 0 }, minWidth: 250 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#6b7280' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {['users', 'admins', 'doctors'].map((tab) => (
                                <Chip
                                    key={tab}
                                    label={tab}
                                    onClick={() => { setActiveTab(tab); setPage(0); }}
                                    sx={{
                                        textTransform: 'capitalize',
                                        fontWeight: 600,
                                        bgcolor: activeTab === tab ? '#0F4C5C' : '#f3f4f6',
                                        color: activeTab === tab ? '#ffffff' : '#4b5563',
                                        '&:hover': {
                                            bgcolor: activeTab === tab ? '#0a3641' : '#e5e7eb',
                                        },
                                        px: 1,
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                                {activeTab === 'doctors' ? (
                                    <>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Specialization</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>State</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Experience</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }} align="right">Actions</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>User</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Role</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Joined</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }} align="right">Actions</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow
                                            key={row._id}
                                            sx={{
                                                '&:hover': { bgcolor: '#F8F9FA' },
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
                                            {activeTab === 'doctors' ? (
                                                <>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: '#2EC4B6',
                                                                    width: 40,
                                                                    height: 40,
                                                                    fontSize: '1rem',
                                                                }}
                                                            >
                                                                {row.Name?.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {row.Name}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{row.Specialization}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{row.State}</Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2">{row.Experience}</Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => navigate(`/dashboard/admin/doctor/${getDoctorUrlName(row.Name)}`)}
                                                                sx={{
                                                                    color: '#0F4C5C',
                                                                    '&:hover': { bgcolor: '#e0f2fe' },
                                                                }}
                                                                title="View"
                                                            >
                                                                <Visibility />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => { /* Edit Implementation Placeholder if needed */ }}
                                                                sx={{
                                                                    color: '#f59e0b',
                                                                    '&:hover': { bgcolor: '#fef3c7' },
                                                                }}
                                                                title="Edit"
                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(row._id, true)}
                                                                sx={{
                                                                    color: '#ef4444',
                                                                    '&:hover': { bgcolor: '#fee2e2' },
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar
                                                                sx={{
                                                                    bgcolor: '#0F4C5C',
                                                                    width: 40,
                                                                    height: 40,
                                                                    fontSize: '1rem',
                                                                }}
                                                            >
                                                                {row.name?.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {row.name}
                                                                </Typography>
                                                                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                                    {row.email}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={row.role}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: `${getRoleColor(row.role)}20`,
                                                                color: getRoleColor(row.role),
                                                                fontWeight: 600,
                                                                textTransform: 'capitalize',
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 8,
                                                                    height: 8,
                                                                    borderRadius: '50%',
                                                                    bgcolor: row.isActive ? '#2EC4B6' : '#ef4444',
                                                                }}
                                                            />
                                                            <Typography variant="body2">
                                                                {row.isActive ? 'Active' : 'Suspended'}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                                            {new Date(row.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleToggleStatus(row)}
                                                                sx={{
                                                                    color: row.isActive ? '#f59e0b' : '#2EC4B6',
                                                                    '&:hover': { bgcolor: row.isActive ? '#fef3c7' : '#d1fae5' },
                                                                }}
                                                                title={row.isActive ? 'Suspend' : 'Activate'}
                                                            >
                                                                {row.isActive ? <Block /> : <CheckCircle />}
                                                            </IconButton>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDelete(row._id, false)}
                                                                sx={{
                                                                    color: '#ef4444',
                                                                    '&:hover': { bgcolor: '#fee2e2' },
                                                                }}
                                                                title="Delete"
                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            No records found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                />
            </CardContent>
        </Card>
    );
};

export default UserManagementTable;
