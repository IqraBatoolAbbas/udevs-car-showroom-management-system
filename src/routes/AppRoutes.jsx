import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Home from '../pages/home/Home';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import AdminLayout from '../layouts/AdminLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import { ROLES } from '../utils/constants';

// Dashboard pages
import AdminDashboard from '../pages/admin/Dashboard';
import StaffDashboard from '../pages/staff/Dashboard';

// Admin pages
import Cars from '../pages/admin/Cars';
import AddCar from '../pages/admin/AddCar';
import Suppliers from '../pages/admin/Suppliers';
import AddSupplier from '../pages/admin/AddSupplier';
import Applications from '../pages/admin/Applications';
import Users from '../pages/admin/Users';
import Customers from '../pages/admin/Customers';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';
import CarDetailsAdmin from '../pages/admin/CarDetailsAdmin';

// Customer pages
import CustomerDashboard from '../pages/customer/Dashboard';
import Showroom from '../pages/customer/Showroom';
import CarDetails from '../pages/customer/CarDetails';
import MyApplications from '../pages/customer/MyApplications';
import Profile from '../pages/customer/Profile';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1565C0', marginBottom: 16 }}>403 - Access Denied</h1>
    <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: 450, marginBottom: 24 }}>
      You do not have the required permissions to view this module. Please login with an authorized account.
    </p>
    <a href="/login" style={{ padding: '10px 24px', background: '#1565C0', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
      Return to Login
    </a>
  </div>
);

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '80px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#1565C0', marginBottom: 16 }}>404 - Page Not Found</h1>
    <p style={{ fontSize: '1.1rem', color: '#6B7280', maxWidth: 450, marginBottom: 24 }}>
      The showroom or management page you are looking for does not exist or has been moved.
    </p>
    <a href="/login" style={{ padding: '10px 24px', background: '#1565C0', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
      Back to Home
    </a>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes (Full Access) */}
          <Route 
            path="/admin/*" 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminLayout />
              </RoleRoute>
            } 
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/add" element={<AddCar />} />
            <Route path="cars/edit/:id" element={<AddCar />} />
            <Route path="cars/:id" element={<CarDetailsAdmin />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="suppliers/add" element={<AddSupplier />} />
            <Route path="suppliers/edit/:id" element={<AddSupplier />} />
            <Route path="customers" element={<Customers />} />
            <Route path="applications" element={<Applications />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
          
          {/* Sales Routes */}
          <Route 
            path="/sales/*" 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SALES]}>
                <AdminLayout />
              </RoleRoute>
            } 
          >
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="showroom" element={<Showroom />} />
            <Route path="cars/:id" element={<CarDetailsAdmin />} />
            <Route path="customers" element={<Customers />} />
            <Route path="applications" element={<Applications />} />
            <Route path="" element={<Navigate to="/sales/dashboard" replace />} />
          </Route>
          
          {/* Inventory Routes */}
          <Route 
            path="/inventory/*" 
            element={
              <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.INVENTORY]}>
                <AdminLayout />
              </RoleRoute>
            } 
          >
            <Route path="dashboard" element={<StaffDashboard />} />
            <Route path="cars" element={<Cars />} />
            <Route path="cars/add" element={<AddCar />} />
            <Route path="cars/edit/:id" element={<AddCar />} />
            <Route path="cars/:id" element={<CarDetailsAdmin />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="suppliers/add" element={<AddSupplier />} />
            <Route path="suppliers/edit/:id" element={<AddSupplier />} />
            <Route path="reports" element={<Reports />} />
            <Route path="" element={<Navigate to="/inventory/dashboard" replace />} />
          </Route>
          
          {/* Customer Routes */}
          <Route 
            path="/customer/*" 
            element={
              <RoleRoute allowedRoles={[ROLES.CUSTOMER]}>
                <CustomerLayout />
              </RoleRoute>
            } 
          >
            <Route path="dashboard" element={<CustomerDashboard />} />
            <Route path="showroom" element={<Showroom />} />
            <Route path="cars/:id" element={<CarDetails />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="" element={<Navigate to="/customer/dashboard" replace />} />
          </Route>
          
          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
