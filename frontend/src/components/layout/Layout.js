import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Divider,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useMediaQuery,
  Collapse,
  ListItemButton,
  Fade,
  Snackbar,
  Alert,
  Zoom,
  Button,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import StorageIcon from '@mui/icons-material/Storage';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RuleIcon from '@mui/icons-material/Rule';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import BugReportIcon from '@mui/icons-material/BugReport';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Scans', icon: <SecurityIcon />, path: '/scans' },
  { text: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'User Management', icon: <PeopleIcon />, path: '/users' },
];

const wazuhMenuItems = [
  { text: 'Agents', icon: <GroupIcon />, path: '/agents' },
  { text: 'Manager', icon: <StorageIcon />, path: '/manager' },
  { text: 'FIM', icon: <ListAltIcon />, path: '/fim/1' },
  { text: 'MITRE', icon: <BugReportIcon />, path: '/mitre' },
  { text: 'Rules', icon: <RuleIcon />, path: '/rules' },
  { text: 'Syscollector', icon: <StorageIcon />, path: '/syscollector/1' },
  { text: 'RBAC', icon: <SecurityIcon />, path: '/roles' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Stats', icon: <BarChartIcon />, path: '/stats' },
  { text: 'Wazuh Settings', icon: <SettingsApplicationsIcon />, path: '/wazuh-settings' },
];

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [wazuhMenuOpen, setWazuhMenuOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isLoading, setIsLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useSelector((state) => state.auth);

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (item.path === '/settings' || item.path === '/users') {
      return user?.role === 'admin';
    }
    return true;
  });

  // Handle screen size changes
  useEffect(() => {
    if (!isMobile && mobileOpen) {
      setMobileOpen(false);
    }
  }, [isMobile]);

  // Simulate loading state when navigating
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setIsLoading(true);
    showNotification('Logging out...', 'info');
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 1000);
  };

  const handleWazuhMenuToggle = () => {
    setWazuhMenuOpen(!wazuhMenuOpen);
  };

  const handleNavigation = (path) => {
    if (isMobile) {
      setMobileOpen(false);
    }
    navigate(path);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: theme.palette.background.dark,
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
    }}>
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(12px)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <SecurityIcon sx={{ 
              fontSize: 32,
              color: theme.palette.secondary.main,
              filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))',
            }} />
          </Zoom>
          <Fade in={true} timeout={1000}>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                color: '#fff',
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              Security Scanner
            </Typography>
          </Fade>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle} 
            sx={{ 
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>
      <List sx={{ 
        flex: 1, 
        pt: 2, 
        px: 2,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '2px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.3)',
          },
        },
      }}>
        {visibleMenuItems.map((item, index) => (
          <Fade in={true} timeout={600} style={{ transitionDelay: `${index * 50}ms` }} key={item.text}>
            <ListItem
              button
              onClick={() => handleNavigation(item.path)}
              selected={isCurrentPath(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 1,
                transition: 'all 0.2s ease-in-out',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(99, 102, 241, 0.16)',
                  backdropFilter: 'blur(12px)',
                  transform: 'translateX(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.24)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: isCurrentPath(item.path) ? theme.palette.secondary.main : 'inherit',
                minWidth: 40,
                transition: 'all 0.2s ease-in-out',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: isCurrentPath(item.path) ? 600 : 500,
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              />
            </ListItem>
          </Fade>
        ))}
        <Divider sx={{ 
          my: 2, 
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          width: '90%',
          mx: 'auto',
        }} />
        <ListItemButton 
          onClick={handleWazuhMenuToggle} 
          sx={{ 
            borderRadius: '12px',
            mb: 1,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          <ListItemText 
            primary="WAZUH FEATURES" 
            sx={{ 
              '& .MuiTypography-root': { 
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(255, 255, 255, 0.7)',
              },
            }} 
          />
          {wazuhMenuOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
        <Collapse in={wazuhMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {wazuhMenuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item.path)}
                selected={isCurrentPath(item.path)}
                sx={{
                  borderRadius: '12px',
                  mb: 1,
                  pl: 4,
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                    backdropFilter: 'blur(12px)',
                    transform: 'translateX(4px)',
                    '&:hover': {
                      backgroundColor: 'rgba(99, 102, 241, 0.24)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: isCurrentPath(item.path) ? theme.palette.secondary.main : 'inherit',
                  minWidth: 40,
                  transition: 'all 0.2s ease-in-out',
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isCurrentPath(item.path) ? 600 : 500,
                      transition: 'all 0.2s ease-in-out',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      <List sx={{ p: 2 }}>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: '12px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.16)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ 
            color: theme.palette.error.main,
            minWidth: 40,
          }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout"
            sx={{
              '& .MuiTypography-root': {
                color: theme.palette.error.main,
                fontWeight: 500,
              },
            }}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: theme.palette.background.default,
      backgroundImage: 'radial-gradient(at 50% 0%, rgba(99, 102, 241, 0.08) 0px, transparent 75%)',
    }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: 'width 0.3s ease',
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderBottom: '1px solid',
          borderColor: 'rgba(226, 232, 240, 0.8)',
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 2, sm: 3 },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { sm: 'none' },
                color: theme.palette.text.primary,
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              noWrap 
              component="div" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontSize: { xs: '1rem', sm: '1.25rem' },
                color: theme.palette.text.primary,
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {visibleMenuItems.find(item => isCurrentPath(item.path))?.text || 
               wazuhMenuItems.find(item => isCurrentPath(item.path))?.text || 
               'Dashboard'}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 2 },
          }}>
            {!isTablet && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<RefreshIcon />}
                onClick={() => window.location.reload()}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: theme.shadows[2],
                  },
                }}
              >
                Refresh
              </Button>
            )}
            <Tooltip title="Search">
              <IconButton 
                onClick={() => setSearchOpen(true)}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleNotificationMenuOpen}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  color: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                  },
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.75rem',
                      height: 18,
                      minWidth: 18,
                      fontWeight: 600,
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Account">
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{
                  padding: { xs: 0.5, sm: 1 },
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(99, 102, 241, 0.16)',
                  },
                }}
                size={isMobile ? 'small' : 'medium'}
              >
                <Avatar sx={{ 
                  width: { xs: 28, sm: 32 }, 
                  height: { xs: 28, sm: 32 },
                  bgcolor: theme.palette.secondary.main,
                  fontWeight: 600,
                }}>
                  <AccountCircleIcon />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        {isLoading && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            height: 2, 
          }}>
            <LinearProgress 
              color="secondary"
              sx={{
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                '& .MuiLinearProgress-bar': {
                  backgroundImage: 'linear-gradient(to right, #6366F1, #818CF8)',
                },
              }}
            />
          </Box>
        )}
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onOpen={() => setMobileOpen(true)}
            onClose={() => setMobileOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(12px)',
              },
            }}
          >
            {drawer}
          </SwipeableDrawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
                backdropFilter: 'blur(12px)',
                boxShadow: '0px 12px 24px rgba(15, 23, 42, 0.08)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        )}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '200px'
            }}
          >
            <CircularProgress color="secondary" />
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <Box>
              <Outlet />
            </Box>
          </Fade>
        )}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'rgba(226, 232, 240, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: '1px solid',
              borderTop: '1px solid',
              borderColor: 'rgba(226, 232, 240, 0.8)',
            },
          },
        }}
      >
        <MenuItem 
          onClick={() => navigate('/profile')} 
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Profile</Typography>
        </MenuItem>
        <MenuItem 
          onClick={() => navigate('/settings')} 
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" sx={{ color: theme.palette.secondary.main }} />
          </ListItemIcon>
          <Typography variant="body2" fontWeight={500}>Settings</Typography>
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          <Typography variant="body2" color="error" fontWeight={500}>Logout</Typography>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={() => setNotificationAnchorEl(null)}
        onClick={() => setNotificationAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            minWidth: 320,
            maxWidth: '90vw',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'rgba(226, 232, 240, 0.8)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            boxShadow: theme.shadows[3],
          },
        }}
      >
        <MenuItem sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom fontWeight={600}>
              New scan completed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              Web application scan finished successfully
            </Typography>
            <Typography variant="caption" color="text.subtle" sx={{ mt: 1 }}>
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" color="error" gutterBottom fontWeight={600}>
              Security alert detected
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              High severity vulnerability found
            </Typography>
            <Typography variant="caption" color="text.subtle" sx={{ mt: 1 }}>
              10 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <Typography variant="subtitle2" color="info" gutterBottom fontWeight={600}>
              System update available
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
              New features and improvements ready
            </Typography>
            <Typography variant="caption" color="text.subtle" sx={{ mt: 1 }}>
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ justifyContent: 'center', py: 1.5 }}>
          <Button
            color="secondary"
            size="small"
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            View all notifications
          </Button>
        </MenuItem>
      </Menu>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: 'rgba(226, 232, 240, 0.8)',
            boxShadow: theme.shadows[2],
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Layout; 