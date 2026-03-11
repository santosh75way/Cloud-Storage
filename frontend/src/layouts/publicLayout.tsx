import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box, Stack } from "@mui/material";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
];

export default function PublicLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={styles.root}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={styles.appBar}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={styles.toolbar}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={styles.logo}
              onClick={() => navigate("/")}
            >
              ☁ CloudVault
            </Typography>

            <Stack direction="row" spacing={1} sx={styles.navStack}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={styles.navButton}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={styles.signInButton}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={styles.getStartedButton}
              >
                Get Started
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={styles.main}>
        <Outlet />
      </Box>
    </Box>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    bgcolor: "#FFFFFF",
  },
  appBar: {
    borderBottom: "1px solid rgba(226, 232, 240, 0.6)",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px)",
    animation: "slideDown 0.3s ease-out",
  },
  toolbar: {
    justifyContent: "space-between",
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
  navStack: {
    display: { xs: "none", md: "flex" },
  },
  navButton: {
    fontWeight: 500,
    textTransform: "none",
    color: "text.secondary",
    borderRadius: 2,
    px: 2,
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#4F46E5",
      bgcolor: "rgba(99, 102, 241, 0.04)",
    },
  },
  signInButton: {
    fontWeight: 600,
    textTransform: "none",
    color: "#64748B",
    borderRadius: 2,
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#4F46E5",
    },
  },
  getStartedButton: {
    borderRadius: 2.5,
    textTransform: "none",
    fontWeight: 600,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
    px: 3,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      boxShadow: "0 4px 16px rgba(99, 102, 241, 0.4)",
      transform: "translateY(-1px)",
    },
  },
  main: {
    flexGrow: 1,
  },
};