import { useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import createAppTheme from './theme/theme';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession, selectAuthLoading, selectAuthUser } from './redux/auth/authSlice';
import { selectThemeMode } from './redux/theme/themeSlice';
import { fetchCollection } from './redux/showroom/showroomSlice';
import { setCars } from './redux/cars/carsSlice';
import { setSuppliers } from './redux/suppliers/suppliersSlice';
import { setCustomers } from './redux/customers/customersSlice';
import { setApplications } from './redux/applications/applicationsSlice';
import { setNotifications } from './redux/notifications/notificationsSlice';
import { ROLES } from './utils/constants';

const AppContent = () => {
  const mode = useSelector(selectThemeMode);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);
  return <ThemeProvider theme={theme}><CssBaseline /><AppRoutes /></ThemeProvider>;
};

function App() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && user) {
      const resources = [['cars', setCars]];
      if (user.role === ROLES.ADMIN || user.role === ROLES.INVENTORY) resources.push(['suppliers', setSuppliers]);
      if (user.role === ROLES.ADMIN || user.role === ROLES.SALES) resources.push(['customers', setCustomers]);
      if (user.role === ROLES.ADMIN || user.role === ROLES.SALES || user.role === ROLES.CUSTOMER) {
        resources.push(['applications', setApplications]);
      }
      if (user.role === ROLES.ADMIN) resources.push(['notifications', setNotifications]);
      resources.forEach(([resource, hydrate]) => {
        dispatch(fetchCollection({ resource })).unwrap()
          .then(({ result }) => dispatch(hydrate(Array.isArray(result) ? result : result.rows || [])))
          .catch(error => console.error(`Unable to load ${resource} from API`, error));
      });
    }
  }, [dispatch, loading, user]);

  return loading ? null : <AppContent />;
}

export default App;
