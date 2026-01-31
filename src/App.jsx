import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';
import UserDashboard from './dashboard/user/UserDashboard';
import AdminDashboard from './dashboard/admin/AdminDashboard';

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
    path: '/dashboard/admin',
    element: <AdminDashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
