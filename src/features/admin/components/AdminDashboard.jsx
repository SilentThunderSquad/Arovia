'use strict';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import Swal from 'sweetalert2';

import DashboardLayout from '@shared/components/layout/DashboardLayout';
import DashboardSettings from '@shared/components/layout/DashboardSettings';
import AdminOverview from './AdminOverview';
import AdminSidebar from './AdminSidebar';
import UserManagementTable from './UserManagementTable';

import adminService from '@features/admin/services/adminService';
import authService from '@shared/services/auth.service';
import userService from '@features/user/services/userService';

import { useAuth } from '@shared/hooks/useAuth';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { profile: userInfo, initializeSession, logout } = useAuth();

  // Synchronize state based on exact browser URL location
  const isSettingsPath = location.pathname.endsWith('/settings');
  const [activeView, setActiveView] = useState(isSettingsPath ? 'settings' : 'overview');

  useEffect(() => {
    setActiveView(isSettingsPath ? 'settings' : 'overview');
  }, [location.pathname, isSettingsPath]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdate = async () => {
    // TODO: OPTIMIZATION - Use targeted API calls instead of full initializeSession()
    await initializeSession();
  };

  const fetchAdminData = async () => {
    try {
      if (!localStorage.getItem('token')) { 
        navigate('/'); 
        return; 
      }

      const [analyticsData, usersData, doctorsData] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getAllUsers(),
        adminService.getAllDoctors(),
      ]);

      setAnalytics(analyticsData);
      setUsers(usersData.users || []);
      setDoctors(doctorsData.doctors || []);
    } catch (error) {
      if (error.message?.includes('403') || error.message?.includes('Admin')) {
        Swal.fire({ 
          title: 'Access Denied', 
          text: 'You do not have permission to view this console.', 
          icon: 'error' 
        }).then(async () => { 
          await logout(); 
          navigate('/'); 
        });
      } else {
        Swal.fire({ title: 'Error', text: 'Failed to load system dashboard analytics.', icon: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F9FA' }}>
        <CircularProgress size={50} sx={{ color: '#0F4C5C' }} />
      </Box>
    );
  }

  // Handle custom active view transitions
  const handleViewChange = (viewId) => {
    if (viewId === 'settings') {
      navigate('/dashboard/admin/settings');
    } else {
      setActiveView(viewId);
      if (location.pathname.endsWith('/settings')) {
        navigate('/dashboard/admin');
      }
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <AdminOverview users={users} doctors={doctors} analytics={analytics} />;
      case 'users':
        return <UserManagementTable users={users} doctors={doctors} onUserUpdate={fetchAdminData} viewMode="users" />;
      case 'admins':
        return <UserManagementTable users={users} doctors={doctors} onUserUpdate={fetchAdminData} viewMode="admins" />;
      case 'doctors':
        return <UserManagementTable users={users} doctors={doctors} onUserUpdate={fetchAdminData} viewMode="doctors" />;
      case 'analytics':
        return <AdminOverview users={users} doctors={doctors} analytics={analytics} />;
      case 'settings':
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} />;
      default:
        return <AdminOverview users={users} doctors={doctors} analytics={analytics} />;
    }
  };

  // Build appropriate header titles based on admin context views
  const getHeaderContext = () => {
    switch (activeView) {
      case 'overview':
        return { title: 'Admin Console', subtitle: 'Global operational summaries, growth analytics, and logs.' };
      case 'users':
        return { title: 'Registered Patients', subtitle: 'Manage active patient profile rosters and access levels.' };
      case 'admins':
        return { title: 'System Administrators', subtitle: 'Manage system admin accounts and access permissions.' };
      case 'doctors':
        return { title: 'Medical Providers', subtitle: 'Verify credentials and manage provider rosters.' };
      case 'analytics':
        return { title: 'System Analytics', subtitle: 'Real-time performance metrics and report logs.' };
      case 'settings':
        return { title: 'System Settings', subtitle: 'Manage identity credentials and visibilities.' };
      default:
        return { title: 'Admin Dashboard', subtitle: 'Operational commands portal.' };
    }
  };

  const context = getHeaderContext();

  return (
    <DashboardLayout
      user={userInfo}
      title={context.title}
      subtitle={context.subtitle}
      onLogout={handleLogout}
      sidebarComponent={(props) => (
        <AdminSidebar 
          {...props} 
          activeView={activeView} 
          setActiveView={handleViewChange} 
        />
      )}
    >
      {renderActiveView()}
    </DashboardLayout>
  );
};

export default AdminDashboard;
