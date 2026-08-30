import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser, selectIsAuthenticated } from '../redux/auth/authSlice';
import { ROLES } from '../utils/constants';

const RoleRoute = ({ children, allowedRoles }) => {
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's role
    const roleRoutes = {
      [ROLES.ADMIN]: '/admin/dashboard',
      [ROLES.SALES]: '/sales/dashboard',
      [ROLES.INVENTORY]: '/inventory/dashboard',
      [ROLES.CUSTOMER]: '/customer/dashboard'
    };
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
  }

  return children;
};

export default RoleRoute;
