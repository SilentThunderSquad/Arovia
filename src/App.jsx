import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ChatWidget from './components/ChatWidget';

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
  return (
    <>
      <RouterProvider router={router} />
      <ChatWidget />
    </>
  );
}

export default App;
