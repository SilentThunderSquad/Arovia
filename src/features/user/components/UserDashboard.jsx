'use strict';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import Swal from 'sweetalert2';

import DashboardLayout from '@shared/components/layout/DashboardLayout';
import DashboardSettings from '@shared/components/layout/DashboardSettings';
import PrescriptionVault from './PrescriptionVault';
import SecuritySettings from './SecuritySettings';
import UserOverview from './UserOverview';
import UserSidebar from './UserSidebar';

import authService from '@shared/services/auth.service';
import userService from '@features/user/services/userService';

import { useAuth } from '@shared/hooks/useAuth';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile: userInfo, initializeSession, logout } = useAuth();

  // Helper to extract active view from URL pathname
  const getActiveViewFromPath = (pathname) => {
    const segments = pathname.toLowerCase().split('/');
    const lastSegment = segments[segments.length - 1];
    
    const validViews = ['overview', 'prescriptions', 'address', 'profile', 'settings', 'security'];
    if (validViews.includes(lastSegment)) {
      return lastSegment;
    }
    
    // Default fallback if path is exactly '/dashboard/user' or anything else
    return 'overview';
  };

  const [activeView, setActiveView] = useState(() => getActiveViewFromPath(location.pathname));

  useEffect(() => {
    setActiveView(getActiveViewFromPath(location.pathname));
  }, [location.pathname]);

  // Handle updates by refreshing the global session state
  // TODO: OPTIMIZATION - Instead of initializeSession() (full re-fetch),
  // dashboards should make targeted API calls to update specific fields,
  // then call updateProfile() to merge changes locally
  const handleUpdate = async () => {
    await initializeSession();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Handle custom active view transitions
  const handleViewChange = (viewId) => {
    if (viewId === 'overview') {
      navigate('/dashboard/user');
    } else {
      navigate(`/dashboard/user/${viewId}`);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <UserOverview userInfo={userInfo} setActiveView={handleViewChange} />;
      case 'prescriptions':
        return <PrescriptionVault userInfo={userInfo} onUpdate={handleUpdate} />;
      case 'address':
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} initialTab={2} />;
      case 'profile':
        // Direct settings sub-tabs mappings for fast SaaS navigation
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} initialTab={0} />;
      case 'settings':
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} initialTab={1} />;
      case 'security':
        return <SecuritySettings userInfo={userInfo} onUpdate={handleUpdate} />;
      default:
        return <UserOverview userInfo={userInfo} setActiveView={handleViewChange} />;
    }
  };

  // Build appropriate header titles based on patient context views
  const getHeaderContext = () => {
    switch (activeView) {
      case 'overview':
        return { title: 'Patient Console', subtitle: 'Secure overview of clinical status, vaults, and completes.' };
      case 'prescriptions':
        return { title: 'Prescription Vault', subtitle: 'Tamper-proof storage of medical orders and PDFs.' };
      case 'address':
        return { title: 'Address Management', subtitle: 'Configure clinical mailing delivery points.' };
      case 'settings':
      case 'profile':
        return { title: 'Settings Console', subtitle: 'Manage identities, visibilities, and credential structures.' };
      case 'security':
        return { title: 'Security Controls', subtitle: 'Configure session tokens and emergency donor status.' };
      default:
        return { title: 'Dashboard', subtitle: 'Welcome back to Arovia Clinic.' };
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
        <UserSidebar 
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

export default UserDashboard;
