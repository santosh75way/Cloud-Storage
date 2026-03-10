import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Container,
  CircularProgress,
} from "@mui/material";
import {
  Home as DashboardIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
  KeyboardArrowDown,
  CloudQueue as DriveIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Suspense, useState } from "react";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "My Drive", icon: <DriveIcon />, path: "/drive" },
    { label: "Shared With Me", icon: <DriveIcon />, path: "/shared-with-me" },
    { label: "Search", icon: <SearchIcon />, path: "/search" },
    { label: "Profile", icon: <ProfileIcon />, path: "/profile/user" },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setAnchorEl(null);
  };

  const [copied, setCopied] = useState(false);
  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box sx={styles.root}>
      <AppBar position="sticky" elevation={0} sx={styles.appBar}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={styles.toolbar}>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={styles.logo}
              onClick={() => navigate("/dashboard")}
            >
              Web App
            </Typography>

            <Box sx={styles.navLinks}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    ...styles.navButton,
                    ...(isActive(item.path) && styles.navButtonActive),
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              endIcon={<KeyboardArrowDown />}
              sx={styles.userButton}
            >
              <Avatar sx={styles.avatar}>
                {user?.email?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box sx={styles.userInfo}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.email?.split("@")[0] || "User"}
                </Typography>
              </Box>
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              sx={styles.menu}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Signed in as
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.email}
                </Typography>
                <Box sx={{ mt: 1.5, p: 1, bgcolor: '#f1f5f9', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      User ID
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                      {user?.id ? `${user.id.substring(0, 10)}...` : 'Unknown'}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={handleCopyId}
                    sx={{ minWidth: 'auto', p: 0.5, color: copied ? 'success.main' : 'text.secondary' }}
                  >
                    {copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <ContentCopyIcon sx={{ fontSize: 16 }} />}
                  </Button>
                </Box>
              </Box>

              <MenuItem onClick={handleLogout} sx={styles.logoutItem}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Container maxWidth="xl" sx={styles.container}>
          <Suspense fallback={<Box sx={styles.loading}><CircularProgress /></Box>}>
            <Outlet />
          </Suspense>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;

const styles = {
  root: {
    minHeight: "100vh",
    bgcolor: "#f8f9fa",
  },
  appBar: {
    bgcolor: "#fff",
    borderBottom: "1px solid #e9ecef",
    color: "#212529",
  },
  toolbar: {
    justifyContent: "space-between",
    py: 1,
  },
  logo: {
    cursor: "pointer",
    color: "primary.main",
    letterSpacing: -0.5,
    "&:hover": {
      opacity: 0.8,
    },
  },
  navLinks: {
    display: "flex",
    gap: 1,
    flex: 1,
    ml: 6,
  },
  navButton: {
    color: "#6c757d",
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 1,
    borderRadius: 2,
    "&:hover": {
      bgcolor: "#f8f9fa",
      color: "#212529",
    },
  },
  navButtonActive: {
    color: "primary.main",
    bgcolor: "#e7f5ff",
    "&:hover": {
      bgcolor: "#d0ebff",
    },
  },
  userButton: {
    textTransform: "none",
    color: "#212529",
    borderRadius: 2,
    px: 1.5,
    "&:hover": {
      bgcolor: "#f8f9fa",
    },
  },
  avatar: {
    width: 32,
    height: 32,
    bgcolor: "primary.main",
    fontSize: "0.875rem",
    fontWeight: 600,
  },
  userInfo: {
    ml: 1.5,
    mr: 0.5,
    textAlign: "left",
    display: { xs: "none", sm: "block" },
  },
  menu: {
    "& .MuiPaper-root": {
      mt: 1,
      minWidth: 180,
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
  },
  logoutItem: {
    color: "#dc3545",
    fontWeight: 500,
    "&:hover": {
      bgcolor: "#fff5f5",
    },
  },
  main: {
    py: 4,
    flex: 1,
  },
  container: {
    minHeight: "calc(100vh - 120px)",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
};
