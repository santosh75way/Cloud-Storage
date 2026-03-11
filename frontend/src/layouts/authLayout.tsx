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
  PeopleAltOutlined as SharedIcon,
} from "@mui/icons-material";
import { Suspense, useState } from "react";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
    { label: "My Drive", icon: <DriveIcon fontSize="small" />, path: "/drive" },
    { label: "Shared", icon: <SharedIcon fontSize="small" />, path: "/shared-with-me" },
    { label: "Search", icon: <SearchIcon fontSize="small" />, path: "/search" },
    { label: "Profile", icon: <ProfileIcon fontSize="small" />, path: "/profile/user" },
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
              fontWeight={800}
              sx={styles.logo}
              onClick={() => navigate("/dashboard")}
            >
              ☁ CloudVault
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
              <Box sx={styles.menuHeader}>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Signed in as
                </Typography>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {user?.email}
                </Typography>
                <Box sx={styles.userIdBox}>
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                      sx={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: 0.5 }}
                    >
                      User ID
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                      {user?.id ? `${user.id.substring(0, 10)}...` : "Unknown"}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={handleCopyId}
                    sx={{
                      minWidth: "auto",
                      p: 0.5,
                      color: copied ? "success.main" : "text.secondary",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {copied ? (
                      <CheckIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <ContentCopyIcon sx={{ fontSize: 16 }} />
                    )}
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
          <Suspense
            fallback={
              <Box sx={styles.loading}>
                <CircularProgress />
              </Box>
            }
          >
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
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    bgcolor: "#F8FAFC",
  },
  appBar: {
    bgcolor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
    color: "#0F172A",
    animation: "slideDown 0.3s ease-out",
  },
  toolbar: {
    justifyContent: "space-between",
    py: 0.5,
    minHeight: { xs: 56, sm: 64 },
  },
  logo: {
    cursor: "pointer",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: -0.5,
    transition: "opacity 0.2s ease",
    "&:hover": {
      opacity: 0.8,
    },
  },
  navLinks: {
    display: { xs: "none", md: "flex" },
    gap: 0.5,
    flex: 1,
    ml: 4,
  },
  navButton: {
    color: "#64748B",
    textTransform: "none",
    fontWeight: 500,
    px: 2,
    py: 0.875,
    borderRadius: 2,
    fontSize: "0.8125rem",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      bgcolor: "rgba(99, 102, 241, 0.04)",
      color: "#4F46E5",
      transform: "translateY(-1px)",
    },
  },
  navButtonActive: {
    color: "#4F46E5",
    bgcolor: "rgba(99, 102, 241, 0.08)",
    fontWeight: 600,
    "&:hover": {
      bgcolor: "rgba(99, 102, 241, 0.12)",
    },
  },
  userButton: {
    textTransform: "none",
    color: "#0F172A",
    borderRadius: 2.5,
    px: 1.5,
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "rgba(99, 102, 241, 0.04)",
    },
  },
  avatar: {
    width: 32,
    height: 32,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
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
      minWidth: 220,
      borderRadius: 3,
      border: "1px solid #E2E8F0",
      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    },
  },
  menuHeader: {
    px: 2,
    py: 1.5,
    borderBottom: "1px solid #F1F5F9",
    mb: 1,
  },
  userIdBox: {
    mt: 1.5,
    p: 1,
    bgcolor: "#F8FAFC",
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #F1F5F9",
  },
  logoutItem: {
    color: "#EF4444",
    fontWeight: 500,
    mx: 1,
    borderRadius: 2,
    "&:hover": {
      bgcolor: "#FEF2F2",
    },
  },
  main: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    animation: "fadeIn 0.4s ease-out",
  },
  container: {
    flex: 1,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
};
