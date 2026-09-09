import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '../redux/auth/authSlice';
import { ROLES } from '../utils/constants';

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasPermission = requiredRole === ROLES.ADMIN
    ? user?.role === ROLES.ADMIN
    : user?.role === ROLES.ADMIN || user?.role === requiredRole;
  if (requiredRole && !hasPermission) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
