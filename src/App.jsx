import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';

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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
