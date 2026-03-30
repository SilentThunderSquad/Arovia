import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';
import UserDashboard from './dashboard/user/UserDashboard';
import UserProfilePage from './dashboard/user/UserProfilePage';
import AdminDashboard from './dashboard/admin/AdminDashboard';
import AdminProfilePage from './dashboard/admin/AdminProfilePage';
import AdminDoctorProfile from './dashboard/admin/AdminDoctorProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/dashboard/user',
    element: <UserDashboard />,
  },
  {
    path: '/dashboard/:username',
    element: <UserProfilePage />,
  },
  {
    path: '/dashboard/admin',
    element: <AdminDashboard />,
  },
  {
    path: '/dashboard/admin/profile',
    element: <AdminProfilePage />,
  },
  {
    path: '/dashboard/admin/doctor/:doctorName',
    element: <AdminDoctorProfile />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />,
  },
  {
    path: '/terms-of-service',
    element: <TermsOfService />,
  },
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
