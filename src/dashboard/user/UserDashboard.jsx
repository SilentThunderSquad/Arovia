import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Avatar, Checkbox, Paper, CircularProgress, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
    LayoutDashboard, CalendarDays, Users, Calendar, Pill, FileText, MessageSquare,
    TestTube, CreditCard, Settings, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';

import ProfilePanel from '../../dashboard/components/ProfilePanel';
import PasswordPanel from '../../dashboard/components/PasswordPanel';
import DeleteAccountPanel from '../../dashboard/components/DeleteAccountPanel';
import AvatarMenu from '../../dashboard/components/AvatarMenu';
import SessionTimer from '../../dashboard/components/SessionTimer';

const SidebarItem = ({ icon: Icon, label, active, badge, isMinimized }) => {
    const itemContent = (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: isMinimized ? 'center' : 'space-between',
            py: 1.25, px: isMinimized ? 0 : 2, cursor: 'pointer', mx: isMinimized ? 1 : 2, mb: 0.5, borderRadius: active ? 2 : 0,
            bgcolor: active ? 'rgba(15, 76, 92, 0.08)' : 'transparent',
            color: active ? '#0F4C5C' : '#6b7280',
            '&:hover': { bgcolor: active ? 'rgba(15, 76, 92, 0.12)' : 'rgba(0,0,0,0.04)' },
            position: 'relative'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: isMinimized ? 0 : 1.5 }}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {!isMinimized && <Typography variant="body2" fontWeight={active ? 600 : 500}>{label}</Typography>}
            </Box>
            {!isMinimized && badge && (
                <Box sx={{ bgcolor: '#8b5cf6', color: '#fff', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {badge}
                </Box>
            )}
            {isMinimized && badge && (
                <Box sx={{ position: 'absolute', top: 4, right: 6, bgcolor: '#8b5cf6', color: '#fff', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 'bold' }}>
                    {badge}
                </Box>
            )}
        </Box>
    );

    return isMinimized ? (
        <Tooltip title={label} placement="right" arrow>
            {itemContent}
        </Tooltip>
    ) : itemContent;
};

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const UserDashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const sidebarWidth = isSidebarMinimized ? 80 : 250;

    const today = new Date();
    const [calendarDate, setCalendarDate] = useState({ month: today.getMonth(), year: today.getFullYear() });

    const goToPrevMonth = () => setCalendarDate(prev => {
        const d = new Date(prev.year, prev.month - 1, 1);
        return { month: d.getMonth(), year: d.getFullYear() };
    });
    const goToNextMonth = () => setCalendarDate(prev => {
        const d = new Date(prev.year, prev.month + 1, 1);
        return { month: d.getMonth(), year: d.getFullYear() };
    });

    const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    useEffect(() => {
        fetchUserData();
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : window.location.origin;
            const res = await fetch(`${apiUrl}/api/user/dashboard-stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDashboardStats(data);
            }
        } catch (e) {
            console.error('Stats fetch error:', e);
        } finally {
            setStatsLoading(false);
        }
    };

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
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setUserInfo(data);

            if (!data.phone || !data.address?.city) {
                setIsProfileOpen(true);
                Swal.fire({
                    title: 'Welcome!', text: 'Please complete your profile to continue.', icon: 'info', confirmButtonColor: '#0F4C5C'
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            // Optionally remove swal to prevent annoyance on dev mode if API is down
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;
            const formData = new FormData();
            if (updatedData.name) formData.append('name', updatedData.name);
            if (updatedData.phone) formData.append('phone', updatedData.phone);
            if (updatedData.dob) formData.append('dob', updatedData.dob);
            if (updatedData.bloodDonation !== undefined) formData.append('bloodDonor', updatedData.bloodDonation);
            if (updatedData.avatarFile) formData.append('profilePicture', updatedData.avatarFile);

            const addressObj = {
                country: updatedData.country, state: updatedData.state, city: updatedData.city,
                pincode: updatedData.pincode, addressLine1: updatedData.address1, addressLine2: updatedData.address2
            };
            formData.append('address', JSON.stringify(addressObj));

            const response = await fetch(`${apiUrl}/api/user/profile`, {
                method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to update profile');
            }
            const data = await response.json();
            setUserInfo(data.user);
            Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Your profile details have been updated successfully.', timer: 2000, showConfirmButton: false });
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.message || 'Failed to update user information', icon: 'error' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;
            const response = await fetch(`${apiUrl}/api/user/delete-account`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Failed to delete account');
            localStorage.clear();
            navigate('/login');
            Swal.fire('Account Deleted', 'Your account and data have been permanently removed.', 'success');
        } catch (error) {
            Swal.fire({ title: 'Error', text: 'Failed to delete account. Please try again.', icon: 'error' });
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
                <CircularProgress size={60} sx={{ color: '#0F4C5C' }} />
            </Box>
        );
    }

    const StatCard = ({ icon: Icon, title, value, badgeText, badgeColor, badgeBg, subtext, subtextNode, iconColor, iconBg }) => (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid #e5e7eb', bgcolor: '#fff', display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: iconBg, color: iconColor }}>
                        <Icon size={22} strokeWidth={2.5} />
                    </Box>
                    <Typography variant="body2" fontWeight="700" sx={{ color: '#374151' }}>{title}</Typography>
                </Box>
                {badgeText && (
                    <Box sx={{ px: 1.5, py: 0.5, borderRadius: 4, bgcolor: badgeBg, color: badgeColor, fontSize: '0.7rem', fontWeight: 700 }}>
                        {badgeText}
                    </Box>
                )}
            </Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#111827', mb: 1, pl: 0.5 }}>{value}</Typography>
            {subtextNode ? (
                <Box sx={{ pl: 0.5, ...subtextNode.sx }}>{subtextNode.content}</Box>
            ) : (
                <Typography variant="caption" sx={{ color: '#6b7280', pl: 0.5, fontWeight: 500 }}>{subtext}</Typography>
            )}
        </Paper>
    );

    const AppointmentRow = ({ time, period, timeBg, name, detail, type, tag, tagColor, tagBg, borderLeft }) => (
        <Box sx={{ display: 'flex', borderRadius: 3, border: '1px solid #f3f4f6', overflow: 'hidden', bgcolor: '#fff', mb: 1.5, position: 'relative' }}>
            {borderLeft && <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, bgcolor: borderLeft }} />}
            <Box sx={{ bgcolor: timeBg, color: '#fff', width: 75, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 1, zIndex: 1 }}>
                <Typography variant="subtitle2" fontWeight="800" sx={{ lineHeight: 1 }}>{time}</Typography>
                <Typography variant="caption" fontWeight="600" sx={{ mt: 0.5, opacity: 0.9 }}>{period}</Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', p: 1.5, gap: 2, pl: 2.5 }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f3f4f6&color=374151`} alt={name} sx={{ width: 48, height: 48 }} />
                <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="700" sx={{ color: '#111827' }}>{name}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', fontWeight: 500 }}>{detail}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>{type}</Typography>
                </Box>
                <Box sx={{ px: 2, py: 0.75, borderRadius: 6, bgcolor: tagBg, color: tagColor, fontSize: '0.75rem', fontWeight: 700 }}>
                    {tag}
                </Box>
            </Box>
        </Box>
    );

    const ScheduleRow = ({ time, name, type }) => (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Typography variant="body2" fontWeight="600" sx={{ width: 65, pt: 1, color: '#4b5563', textAlign: 'right' }}>{time}</Typography>
            <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Box sx={{ mt: 1.5, width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6', border: '2.5px solid #fff', boxShadow: '0 0 0 1px #e5e7eb' }} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar src={`https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=f3f4f6&color=374151`} sx={{ width: 36, height: 36 }} />
                <Box>
                    <Typography variant="body2" fontWeight="700" sx={{ color: '#111827' }}>{name}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>{type}</Typography>
                </Box>
            </Box>
        </Box>
    );

    const DoctorRow = ({ name, detail, subDetail, rating, fee }) => (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid #f3f4f6', '&:last-child': { borderBottom: 'none' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar src={`https://ui-avatars.com/api/?name=Dr+${name.replace(' ', '+')}&background=f3f4f6&color=374151`} alt={name} sx={{ width: 44, height: 44 }} />
                <Box>
                    <Typography variant="body2" fontWeight="700" sx={{ color: '#111827' }}>Dr. {name}</Typography>
                    <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, display: 'block' }}>{detail}</Typography>
                    <Typography variant="caption" sx={{ color: '#9ca3af', fontWeight: 500 }}>{subDetail}</Typography>
                </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mb: 0.5 }}>
                    <Typography variant="caption" fontWeight="800" sx={{ color: '#f59e0b' }}>★ {rating}</Typography>
                </Box>
                <Typography variant="body2" fontWeight="700" sx={{ color: '#0d9488' }}>{fee}</Typography>
            </Box>
        </Box>
    );

    const TaskRow = ({ checked, textHtml, subtextHtml }) => (
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <Checkbox checked={checked} sx={{ p: 0, '& .MuiSvgIcon-root': { fontSize: 22, borderRadius: 1 }, color: '#d1d5db', '&.Mui-checked': { color: '#3b82f6' } }} />
            <Box sx={{ flex: 1, pt: 0.25 }}>
                <Typography variant="body2" component="div" sx={{ color: '#374151', fontWeight: 500, '& span.red': { color: '#ef4444', fontWeight: 700 }, '& span.green': { color: '#10b981', fontWeight: 700 } }} dangerouslySetInnerHTML={{ __html: textHtml }} />
                {subtextHtml && <Typography variant="caption" component="div" sx={{ color: '#f59e0b', textAlign: 'right', display: 'block', pr: 1, fontWeight: 700, mt: 0.5 }} dangerouslySetInnerHTML={{ __html: subtextHtml }} />}
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F7F8' }}>
            {/* Sidebar */}
            <Box sx={{ width: sidebarWidth, transition: 'width 0.3s ease', bgcolor: '#ffffff', color: '#6b7280', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100, borderRight: '1px solid rgba(0,0,0,0.08)', boxShadow: '4px 0 24px rgba(0,0,0,0.02)' }}>
                {/* Toggle Area */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarMinimized ? 'center' : 'flex-end', p: 2, height: 72, transition: 'all 0.3s ease' }}>
                    <IconButton onClick={() => setIsSidebarMinimized(!isSidebarMinimized)} sx={{ color: '#0F4C5C' }}>
                        {isSidebarMinimized ? <Menu size={24} /> : <ChevronLeft size={24} />}
                    </IconButton>
                </Box>
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }} />
                
                {/* Navigation */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mt: 1, overflowY: 'auto' }}>
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" active isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={CalendarDays} label="Appointments" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={Users} label="Patients" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={Calendar} label="Calendar" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={Pill} label="Prescriptions" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={FileText} label="Reports" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={MessageSquare} label="Messages" badge="4" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={TestTube} label="Lab Results" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={CreditCard} label="Billing" isMinimized={isSidebarMinimized} />
                    <SidebarItem icon={Settings} label="Settings" isMinimized={isSidebarMinimized} />
                </Box>
                
                {/* Availability Card */}
                {!isSidebarMinimized && (
                    <Box sx={{ m: 3, p: 3, borderRadius: 4, background: 'linear-gradient(135deg, #4c3f91 0%, #2f2563 100%)', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: 12, right: 12, opacity: 0.1 }}>
                            <Typography variant="h1" fontWeight="900">⚕</Typography>
                        </Box>
                        <Typography variant="body1" fontWeight="700" sx={{ mb: 1, color: '#fff', position: 'relative', zIndex: 2 }}>Set Your Availability</Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 2.5, lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
                            Let patients book appointments that fit your schedule.
                        </Typography>
                        <Button variant="contained" fullWidth sx={{ bgcolor: '#fff', color: '#4c3f91', textTransform: 'none', borderRadius: 2.5, fontWeight: 700, py: 1, '&:hover': { bgcolor: '#f3f4f6' } }}>
                            Manage Schedule
                        </Button>
                    </Box>
                )}
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, ml: `${sidebarWidth}px`, transition: 'margin-left 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                {/* Header Top Bar */}
                <Box sx={{ height: 72, bgcolor: '#0f4c5c', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, position: 'sticky', top: 0, zIndex: 90 }}>
                    {/* Main Header Logo */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', minWidth: 24 }}>
                            <Box sx={{ width: 10, height: 10, bgcolor: '#FFB703', borderRadius: '3px' }} />
                            <Box sx={{ width: 10, height: 10, bgcolor: '#2EC4B6', borderRadius: '3px' }} />
                            <Box sx={{ width: 10, height: 10, bgcolor: '#2EC4B6', borderRadius: '3px' }} />
                            <Box sx={{ width: 10, height: 10, bgcolor: '#FFB703', borderRadius: '3px' }} />
                        </Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', whiteSpace: 'nowrap' }} letterSpacing="-0.5px">Arovia Dashboard</Typography>
                    </Box>
                    
                    {/* User Profile */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <SessionTimer onSessionExpire={handleLogout} />
                        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 500 }}>
                            Welcome back, {userInfo?.name?.split(' ')[0] || 'Anuj'}
                        </Typography>
                        <AvatarMenu user={userInfo} onEditProfile={() => setIsProfileOpen(true)} onChangePassword={() => setIsPasswordOpen(true)} onLogout={handleLogout} onDeleteAccount={() => setIsDeleteOpen(true)} />
                    </Box>
                </Box>

                {/* Dashboard Content */}
                <Box sx={{ p: 4, flex: 1 }}>
                    <Typography variant="h4" fontWeight="800" sx={{ color: '#1f2937', mb: 0.5 }}>
                        Welcome back, {userInfo?.name?.split(' ')[0] || 'Anuj'}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, fontWeight: 500 }}>
                        Here's what's happening with your practice today.
                    </Typography>

                    {/* Stat Cards Row */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                        <StatCard 
                            icon={CalendarDays} title="Today's Appointments"
                            value={statsLoading ? '—' : String(dashboardStats?.todayAppointments ?? 0)}
                            badgeText={statsLoading ? '' : (dashboardStats?.todayAppointments > 0 ? '✓ Active' : '• None')}
                            badgeColor={dashboardStats?.todayAppointments > 0 ? '#0d9488' : '#6b7280'}
                            badgeBg={dashboardStats?.todayAppointments > 0 ? '#ccfbf1' : '#f3f4f6'}
                            subtext={statsLoading ? 'Loading...' : (dashboardStats?.nextAppointmentLabel || 'No appointments today')}
                            iconColor="#2563eb" iconBg="#eff6ff" 
                        />
                        <StatCard 
                            icon={Users} title="Total Patients"
                            value={statsLoading ? '—' : dashboardStats?.totalPatients?.toLocaleString() ?? '0'}
                            badgeText={statsLoading ? '' : '• Registered'}
                            badgeColor="#0d9488" badgeBg="#ccfbf1"
                            subtext={statsLoading ? 'Loading...' : 'All active registered users'}
                            iconColor="#0d9488" iconBg="#ccfbf1" 
                        />
                        <StatCard 
                            icon={TestTube} title="Pending Reports"
                            value={statsLoading ? '—' : String(dashboardStats?.pendingReports ?? 0)}
                            badgeText={statsLoading ? '' : (dashboardStats?.pendingReports > 0 ? '⚠ Pending' : '✓ Clear')}
                            badgeColor={dashboardStats?.pendingReports > 0 ? '#ea580c' : '#0d9488'}
                            badgeBg={dashboardStats?.pendingReports > 0 ? '#ffedd5' : '#ccfbf1'}
                            subtext={statsLoading ? 'Loading...' : 'Lab results awaiting review'}
                            iconColor="#ea580c" iconBg="#ffedd5" 
                        />
                        <StatCard 
                            icon={MessageSquare} title="Messages"
                            value={statsLoading ? '—' : String(dashboardStats?.totalMessages ?? 0)}
                            badgeText={statsLoading ? '' : (dashboardStats?.unreadMessages > 0 ? `• ${dashboardStats.unreadMessages} new` : '• Read')}
                            badgeColor={dashboardStats?.unreadMessages > 0 ? '#7c3aed' : '#6b7280'}
                            badgeBg={dashboardStats?.unreadMessages > 0 ? '#ede9fe' : '#f3f4f6'}
                            subtext={statsLoading ? 'Loading...' : `${dashboardStats?.unreadMessages ?? 0} unread messages`}
                            iconColor="#7c3aed" iconBg="#ede9fe" 
                        />
                    </Box>
                    
                    {/* Middle Row: Appointments & Schedule */}
                    <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                        {/* Today's Appointments */}
                        <Paper elevation={0} sx={{ flex: 1.5, borderRadius: 4, border: '1px solid #e5e7eb', p: 3, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="800" sx={{ color: '#111827' }}>Today's Appointments</Typography>
                                <Button variant="outlined" size="small" sx={{ borderRadius: 6, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151', fontWeight: 600, px: 2 }}>View All</Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {statsLoading ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#0F4C5C' }} /></Box>
                                ) : dashboardStats?.todayAppointmentsList?.length > 0 ? (
                                    dashboardStats.todayAppointmentsList.map((apt, i) => {
                                        const timeParts = apt.time?.split(' ') || ['12:00', 'PM'];
                                        return (
                                            <AppointmentRow 
                                                key={apt._id || i}
                                                time={timeParts[0]} 
                                                period={timeParts[1]} 
                                                timeBg={i % 2 === 0 ? "#5b21b6" : "#2EC4B6"} 
                                                name={apt.patientName} 
                                                detail={apt.doctorName} 
                                                type={apt.type} 
                                                tag={apt.status} 
                                                tagColor={apt.status === 'Completed' ? '#0d9488' : '#7c3aed'} 
                                                tagBg={apt.status === 'Completed' ? '#ccfbf1' : '#f3e8ff'} 
                                            />
                                        );
                                    })
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.6 }}>
                                        <Calendar size={40} style={{ marginBottom: 8, opacity: 0.2 }} />
                                        <Typography variant="body2">No appointments scheduled for today.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                        
                        {/* Upcoming Schedule */}
                        <Paper elevation={0} sx={{ flex: 1, borderRadius: 4, border: '1px solid #e5e7eb', p: 3, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="800" sx={{ color: '#111827' }}>Upcoming Schedule</Typography>
                                <Button variant="outlined" size="small" sx={{ borderRadius: 6, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151', fontWeight: 600, px: 2 }}>View Calendar</Button>
                            </Box>
                            <Box sx={{ position: 'relative', ml: 1 }}>
                                {/* Vertical line connecting dots */}
                                <Box sx={{ position: 'absolute', left: 78, top: 16, bottom: 24, width: 2, bgcolor: '#f3f4f6' }} />
                                {statsLoading ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#0F4C5C' }} /></Box>
                                ) : dashboardStats?.upcomingSchedule?.length > 0 ? (
                                    dashboardStats.upcomingSchedule.map((apt, i) => (
                                        <ScheduleRow key={apt._id || i} time={apt.time || 'Next Day'} name={apt.patientName} type={apt.type} />
                                    ))
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.6 }}>
                                        <Typography variant="body2">No future appointments.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Box>

                    {/* Bottom Row */}
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        {/* Doctor Suggestions */}
                        <Paper elevation={0} sx={{ flex: 2, borderRadius: 4, border: '1px solid #e5e7eb', p: 3, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" fontWeight="800" sx={{ color: '#111827' }}>Doctor Suggestions</Typography>
                                <Button variant="outlined" size="small" sx={{ borderRadius: 6, textTransform: 'none', borderColor: '#e5e7eb', color: '#374151', fontWeight: 600, px: 2 }}>View All</Button>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {statsLoading ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#0F4C5C' }} /></Box>
                                ) : dashboardStats?.doctorSuggestions?.length > 0 ? (
                                    dashboardStats.doctorSuggestions.map((doc, i) => (
                                        <DoctorRow key={i} name={doc.name} detail={doc.detail} subDetail={doc.subDetail} rating={doc.rating} fee={doc.fee} />
                                    ))
                                ) : (
                                    <Box sx={{ py: 4, textAlign: 'center', opacity: 0.6 }}>
                                        <Typography variant="body2">No doctor suggestions available.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                        
                        {/* Checklist */}
                        <Paper elevation={0} sx={{ flex: 1.5, borderRadius: 4, border: '1px solid #e5e7eb', p: 3, pt: 4, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {statsLoading ? (
                                    <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress size={24} sx={{ color: '#0F4C5C' }} /></Box>
                                ) : (
                                    <>
                                        <TaskRow checked={dashboardStats?.pendingReports === 0} textHtml={`Review lab results ${dashboardStats?.pendingReports > 0 ? `<span class='red'>- ${dashboardStats.pendingReports} pending</span>` : `<span class='green'>All clear</span>`}`} />
                                        <TaskRow checked={dashboardStats?.unreadMessages === 0} textHtml={`Reply to messages ${dashboardStats?.unreadMessages > 0 ? `<span class='red'>- ${dashboardStats.unreadMessages} new</span>` : `<span class='green'>Done</span>`}`} />
                                        <TaskRow checked={dashboardStats?.todayAppointments === 0} textHtml={`Manage today's schedule ${dashboardStats?.todayAppointments > 0 ? `<span class='red'>- ${dashboardStats.todayAppointments} active</span>` : `<span class='green'>Completed</span>`}`} />
                                        <TaskRow checked={true} textHtml="Clean and sanitize workspace" />
                                        <TaskRow checked={true} textHtml="Update digital patient records" />
                                    </>
                                )}
                            </Box>
                        </Paper>
                        
                        {/* Calendar – Dynamic */}
                        <Paper elevation={0} sx={{ flex: 1.2, borderRadius: 4, border: '1px solid #e5e7eb', p: 3, bgcolor: '#fff' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#111827' }}>
                                    {MONTH_NAMES[calendarDate.month]} {calendarDate.year}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <IconButton size="small" onClick={goToPrevMonth} sx={{ color: '#6b7280', '&:hover': { color: '#6366f1' } }}><ChevronLeft size={18} /></IconButton>
                                    <IconButton size="small" onClick={goToNextMonth} sx={{ color: '#6b7280', '&:hover': { color: '#6366f1' } }}><ChevronRight size={18} /></IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center' }}>
                                {DAY_NAMES.map(day => (
                                    <Typography key={day} variant="caption" sx={{ color: '#9ca3af', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>{day}</Typography>
                                ))}
                                {/* Empty cells before first day */}
                                {Array.from({ length: getFirstDayOfMonth(calendarDate.month, calendarDate.year) }).map((_, i) => (
                                    <Box key={`empty-${i}`} />
                                ))}
                                {/* Actual days */}
                                {Array.from({ length: getDaysInMonth(calendarDate.month, calendarDate.year) }, (_, i) => i + 1).map(date => {
                                    const isToday =
                                        date === today.getDate() &&
                                        calendarDate.month === today.getMonth() &&
                                        calendarDate.year === today.getFullYear();
                                    return (
                                        <Box key={date} sx={{
                                            width: 26, height: 26, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            borderRadius: '50%', fontSize: '0.75rem', fontWeight: isToday ? 800 : 600,
                                            color: isToday ? '#fff' : '#4b5563',
                                            bgcolor: isToday ? '#6366f1' : 'transparent',
                                            boxShadow: isToday ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
                                            cursor: 'default',
                                            transition: 'all 0.15s',
                                            '&:hover': { bgcolor: isToday ? '#4f46e5' : '#f3f4f6' }
                                        }}>
                                            {date}
                                        </Box>
                                    );
                                })}
                            </Box>
                            {/* Today label */}
                            <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#6366f1', flexShrink: 0 }} />
                                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                                    Today: {today.getDate()} {MONTH_NAMES[today.getMonth()]} {today.getFullYear()}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>

                </Box>
            </Box>

            {/* Side Panels */}
            <ProfilePanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={userInfo} onSave={handleUpdateUser} />
            <PasswordPanel isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} />
            <DeleteAccountPanel isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onDeleteConfirm={handleDeleteAccount} />
        </Box>
    );
};

export default UserDashboard;
