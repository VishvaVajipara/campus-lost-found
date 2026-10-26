import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

// Wraps pages that need login. If the user is not logged in, send them to /login.
function ProtectedRoute() {
  const { user, loading } = useAuth();

  // Wait until we have checked the saved token, otherwise a refresh would log the user out
  if (loading) return <Loading text="Checking your session..." />;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />; // shows the child page
}

export default ProtectedRoute;
