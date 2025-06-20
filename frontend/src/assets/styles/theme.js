import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F172A',  // Dark slate blue
      light: '#334155',
      dark: '#020617',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366F1',  // Modern indigo
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
      dark: '#0F172A',
      card: 'rgba(255, 255, 255, 0.9)',
      subtle: 'rgba(255, 255, 255, 0.7)',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      subtle: '#94A3B8',
    },
    error: {
      main: '#EF4444',  // Modern red
      light: '#FCA5A5',
      dark: '#DC2626',
    },
    warning: {
      main: '#F59E0B',  // Modern amber
      light: '#FCD34D',
      dark: '#D97706',
    },
    info: {
      main: '#3B82F6',  // Modern blue
      light: '#93C5FD',
      dark: '#2563EB',
    },
    success: {
      main: '#10B981',  // Modern emerald
      light: '#6EE7B7',
      dark: '#059669',
    },
    divider: 'rgba(226, 232, 240, 0.8)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(15, 23, 42, 0.08)',
    '0px 2px 4px rgba(15, 23, 42, 0.08)',
    '0px 4px 8px rgba(15, 23, 42, 0.08)',
    '0px 8px 16px rgba(15, 23, 42, 0.08)',
    '0px 16px 24px rgba(15, 23, 42, 0.08)',
    '0px 24px 32px rgba(15, 23, 42, 0.08)',
    ...Array(17).fill('none'),
  ],
  components: {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0F172A',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          color: '#ffffff',
          borderRight: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(15, 23, 42, 0.08)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'rgba(226, 232, 240, 0.8)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 16px rgba(15, 23, 42, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(99, 102, 241, 0.16)',
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.24)',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(15, 23, 42, 0.04)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6366F1',
            borderWidth: '1.5px',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1.5px',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(226, 232, 240, 0.8)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          fontWeight: 500,
          '&.MuiChip-filled': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'rgba(226, 232, 240, 0.8)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          color: '#059669',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          color: '#DC2626',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          color: '#D97706',
        },
        standardInfo: {
          backgroundColor: 'rgba(59, 130, 246, 0.08)',
          color: '#2563EB',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#6366F1',
          color: '#ffffff',
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          minWidth: '20px',
          height: '20px',
          padding: '0 6px',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          overflow: 'hidden',
        },
        bar: {
          borderRadius: '8px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(226, 232, 240, 0.8)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme; 