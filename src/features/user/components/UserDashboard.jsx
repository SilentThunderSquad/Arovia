'use strict';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, CircularProgress } from '@mui/material';

import Swal from 'sweetalert2';

import DashboardLayout from '@shared/components/layout/DashboardLayout';
import DashboardSettings from '@shared/components/layout/DashboardSettings';
import AddressManager from './AddressManager';
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

  // Synchronize state based on exact browser URL location
  const isSettingsPath = location.pathname.endsWith('/settings');
  const [activeView, setActiveView] = useState(isSettingsPath ? 'settings' : 'overview');

  useEffect(() => {
    setActiveView(isSettingsPath ? 'settings' : 'overview');
  }, [location.pathname, isSettingsPath]);

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
    if (viewId === 'settings') {
      navigate('/dashboard/user/settings');
    } else {
      setActiveView(viewId);
      if (location.pathname.endsWith('/settings')) {
        navigate('/dashboard/user');
      }
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return <UserOverview userInfo={userInfo} setActiveView={handleViewChange} />;
      case 'prescriptions':
        return <PrescriptionVault userInfo={userInfo} onUpdate={handleUpdate} />;
      case 'records':
        return <AddressManager userInfo={userInfo} onUpdate={handleUpdate} />;
      case 'profile':
        // Direct settings sub-tabs mappings for fast SaaS navigation
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} />;
      case 'settings':
        return <DashboardSettings user={userInfo} onUpdate={handleUpdate} />;
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
      case 'records':
        return { title: 'Records Management', subtitle: 'Configure clinical mailing delivery points.' };
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
