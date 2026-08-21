import { createContext, useContext, useState, useEffect } from 'react';
import localStorageService, { STORAGE_KEYS } from '../services/localStorageService';

const ThemeModeContext = createContext(null);

export const ThemeModeProvider = ({ children }) => {
  const settings = localStorageService.getData(STORAGE_KEYS.SETTINGS, {});
  const [mode, setMode] = useState(settings.themeMode === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    // Set data-theme attribute on document for CSS variables
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleThemeMode = () => {
    setMode(currentMode => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light';
      localStorageService.setData(STORAGE_KEYS.SETTINGS, { ...localStorageService.getData(STORAGE_KEYS.SETTINGS, {}), themeMode: nextMode });
      return nextMode;
    });
  };

  return <ThemeModeContext.Provider value={{ mode, toggleThemeMode }}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => useContext(ThemeModeContext);
