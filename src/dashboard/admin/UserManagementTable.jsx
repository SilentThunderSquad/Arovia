import { useState, useMemo } from 'react';
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Chip,
    Avatar,
    Typography,
    InputAdornment,
} from '@mui/material';
import {
    Search,
    FilterList,
    Delete,
    Block,
    CheckCircle,
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const UserManagementTable = ({ users, onUserUpdate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredUsers = useMemo(() => {
        let result = users || [];

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(
                (user) =>
                    user.name?.toLowerCase().includes(lowerTerm) ||
                    user.email?.toLowerCase().includes(lowerTerm)
            );
        }

        if (roleFilter !== 'all') {
            result = result.filter((user) => user.role === roleFilter);
        }

        return result;
    }, [users, searchTerm, roleFilter]);

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

    const handleRoleFilter = (e) => {
        setRoleFilter(e.target.value);
        setPage(0);
    };

    const handleDelete = async (userId) => {
        const result = await Swal.fire({
            title: 'Delete User?',
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

                const response = await fetch(`${apiUrl}/api/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error('Failed to delete');

                onUserUpdate();
                Swal.fire({
                    title: 'Deleted!',
                    text: 'User has been removed.',
                    icon: 'success',
                    background: '#ffffff',
                    color: '#111827',
                    iconColor: '#2EC4B6',
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to delete user',
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

    return (
        <Card sx={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <CardContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#0F4C5C' }}>
                        User Management
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                            size="small"
                            sx={{ flexGrow: 1, minWidth: 250 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: '#6b7280' }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Filter by Role</InputLabel>
                            <Select
                                value={roleFilter}
                                onChange={handleRoleFilter}
                                label="Filter by Role"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterList sx={{ color: '#6b7280', ml: 1 }} />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">All Roles</MenuItem>
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="doctor">Doctor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#F8F9FA' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>User</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }}>Joined</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#0F4C5C' }} align="right">
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user) => (
                                        <TableRow
                                            key={user._id}
                                            sx={{
                                                '&:hover': { bgcolor: '#F8F9FA' },
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
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
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                            {user.name}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                                            {user.email}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: `${getRoleColor(user.role)}20`,
                                                        color: getRoleColor(user.role),
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
                                                            bgcolor: user.isActive ? '#2EC4B6' : '#ef4444',
                                                        }}
                                                    />
                                                    <Typography variant="body2">
                                                        {user.isActive ? 'Active' : 'Suspended'}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleStatus(user)}
                                                        sx={{
                                                            color: user.isActive ? '#f59e0b' : '#2EC4B6',
                                                            '&:hover': { bgcolor: user.isActive ? '#fef3c7' : '#d1fae5' },
                                                        }}
                                                        title={user.isActive ? 'Suspend' : 'Activate'}
                                                    >
                                                        {user.isActive ? <Block /> : <CheckCircle />}
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(user._id)}
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
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                            No users found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={filteredUsers.length}
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
