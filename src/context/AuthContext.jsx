import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';
import { ROUTES, ROLES } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorageService.getData(STORAGE_KEYS.SESSION);
    if (session) {
      const users = localStorageService.getData(STORAGE_KEYS.USERS, []);
      const account = users.find(item => item.id === session.id || item.email?.toLowerCase() === session.email?.toLowerCase());
      if (account?.status === 'active') {
        const refreshedSession = {
          id: account.id,
          email: account.email,
          name: account.name,
          role: account.role,
          status: account.status
        };
        setUser(refreshedSession);
        localStorageService.setData(STORAGE_KEYS.SESSION, refreshedSession);
      } else {
        localStorageService.removeData(STORAGE_KEYS.SESSION);
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = localStorageService.getData(STORAGE_KEYS.USERS, []);
    const foundUser = users.find(u => u.email?.toLowerCase() === email.trim().toLowerCase() && u.password === password);

    if (foundUser) {
      if (foundUser.status !== 'active') {
        return { success: false, error: 'This account is inactive. Please contact an administrator.' };
      }
      const sessionData = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        status: foundUser.status
      };

      setUser(sessionData);
      localStorageService.setData(STORAGE_KEYS.SESSION, sessionData);

      // Log activity
      logActivity('login', 'user', foundUser.id, `User ${foundUser.email} logged in`);

      // Redirect based on role
      redirectBasedOnRole(foundUser.role);

      return { success: true, user: sessionData };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    if (user) {
      logActivity('logout', 'user', user.id, `User ${user.email} logged out`);
    }
    
    setUser(null);
    localStorageService.removeData(STORAGE_KEYS.SESSION);
    navigate(ROUTES.LOGIN);
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case ROLES.ADMIN:
        navigate(ROUTES.ADMIN_DASHBOARD);
        break;
      case ROLES.SALES:
        navigate(ROUTES.SALES_DASHBOARD);
        break;
      case ROLES.INVENTORY:
        navigate(ROUTES.INVENTORY_DASHBOARD);
        break;
      case ROLES.CUSTOMER:
        navigate(ROUTES.CUSTOMER_DASHBOARD);
        break;
      default:
        navigate(ROUTES.LOGIN);
    }
  };

  const logActivity = (type, entity, entityId, description) => {
    const logs = localStorageService.getData(STORAGE_KEYS.ACTIVITY_LOGS, []);
    const newLog = {
      id: localStorageService.generateId('LOG'),
      type,
      entity,
      entityId,
      description,
      userId: user?.id || null,
      userEmail: user?.email || null,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.pop();
    }
    
    localStorageService.setData(STORAGE_KEYS.ACTIVITY_LOGS, logs);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    if (requiredRole === ROLES.ADMIN) {
      return user.role === ROLES.ADMIN;
    }
    
    // Sales and Inventory can access their own pages
    if (user.role === ROLES.ADMIN) return true;
    
    return user.role === requiredRole;
  };

  const canAccessModule = (module) => {
    if (!user) return false;
    
    const modulePermissions = {
      cars: [ROLES.ADMIN, ROLES.SALES, ROLES.INVENTORY],
      suppliers: [ROLES.ADMIN, ROLES.INVENTORY],
      customers: [ROLES.ADMIN, ROLES.SALES],
      applications: [ROLES.ADMIN, ROLES.SALES],
      users: [ROLES.ADMIN],
      reports: [ROLES.ADMIN, ROLES.INVENTORY],
      settings: [ROLES.ADMIN],
      showroom: [ROLES.ADMIN, ROLES.SALES, ROLES.CUSTOMER],
      profile: [ROLES.ADMIN, ROLES.SALES, ROLES.INVENTORY, ROLES.CUSTOMER]
    };

    const allowedRoles = modulePermissions[module] || [];
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    redirectBasedOnRole,
    logActivity,
    hasPermission,
    canAccessModule,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
