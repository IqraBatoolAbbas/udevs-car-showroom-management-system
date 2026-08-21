import { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from './routes/AppRoutes';
import createAppTheme from './theme/theme';
import seedInitialData from './data/seedData';
import { ThemeModeProvider, useThemeMode } from './context/ThemeModeContext';

const AppContent = () => {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return <ThemeProvider theme={theme}><CssBaseline /><AppRoutes /></ThemeProvider>;
};

function App() {
  // Seed before route/authentication components read LocalStorage.
  useState(() => {
    seedInitialData();
    return true;
  });

  return (
    <ThemeModeProvider><AppContent /></ThemeModeProvider>
  );
}

export default App;
