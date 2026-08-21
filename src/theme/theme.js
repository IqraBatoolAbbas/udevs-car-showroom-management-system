import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode = 'light') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1565C0', // Professional royal blue
      light: '#5e92f3',
      dark: '#003c8f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00ACC1', // Teal cyan
      light: '#5DDFE8',
      dark: '#007C91',
      contrastText: '#ffffff',
    },
    background: {
      default: mode === 'dark' ? '#071321' : '#F8F9FA',
      paper: mode === 'dark' ? '#10263a' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#F8FAFC' : '#071321',
      secondary: mode === 'dark' ? '#B8C4D0' : '#6B7280',
    },
    success: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#047857',
    },
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#B45309',
    },
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
    },
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '2rem',
      fontWeight: 800,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    h6: {
      fontFamily: '"Space Grotesk", "Inter", sans-serif',
      fontSize: '1rem',
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 10,
          padding: '10px 22px',
          fontSize: '0.92rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 6px 16px rgba(21, 101, 192, 0.2)',
          },
        },
        contained: {
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 28px rgba(0,0,0,0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        },
        head: {
          backgroundColor: mode === 'dark' ? '#1a2d3d' : '#F3F4F6',
          fontWeight: 800,
          color: mode === 'dark' ? '#F8FAFC' : '#1F2937',
          fontSize: '0.88rem',
          letterSpacing: '0.2px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
          '&.MuiTableRow-hover:hover': {
            backgroundColor: 'rgba(21, 101, 192, 0.04)',
          },
        },
      },
    },
  },
});

export default createAppTheme;
