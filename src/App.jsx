import { useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import createAppTheme from './theme/theme';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession, selectAuthLoading } from './redux/auth/authSlice';
import { selectThemeMode } from './redux/theme/themeSlice';

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

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return loading ? null : <AppContent />;
}

export default App;
