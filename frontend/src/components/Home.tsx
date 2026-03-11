import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { CloudUploadOutlined, ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={styles.hero}>
        <Box sx={styles.iconBox}>
          <CloudUploadOutlined sx={{ fontSize: 40, color: "#fff" }} />
        </Box>

        <Typography
          variant="h1"
          fontWeight={800}
          sx={styles.heading}
        >
          Your files.{" "}
          <Box
            component="span"
            sx={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Everywhere.
          </Box>
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={400}
          sx={styles.subtitle}
        >
          Store, share, and access your files from anywhere.
          Secure cloud storage with a beautiful, modern interface.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate("/signup")}
            sx={styles.ctaButton}
          >
            Get Started Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
            sx={styles.secondaryButton}
          >
            Sign In
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}

const styles = {
  hero: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    py: 8,
    animation: "fadeInUp 0.6s ease-out",
  },
  iconBox: {
    width: 80,
    height: 80,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 4,
    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
    animation: "scaleIn 0.5s ease-out",
  },
  heading: {
    fontSize: { xs: "2.5rem", md: "3.5rem" },
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    mb: 3,
    color: "#0F172A",
  },
  subtitle: {
    maxWidth: 520,
    mx: "auto",
    mb: 5,
    lineHeight: 1.7,
  },
  ctaButton: {
    px: 4,
    py: 1.5,
    borderRadius: 2.5,
    fontWeight: 700,
    fontSize: "1rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
      transform: "translateY(-2px)",
    },
  },
  secondaryButton: {
    px: 4,
    py: 1.5,
    borderRadius: 2.5,
    fontWeight: 600,
    fontSize: "1rem",
    borderColor: "#E2E8F0",
    borderWidth: "1.5px",
    color: "#475569",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#CBD5E1",
      bgcolor: "#F8FAFC",
      transform: "translateY(-1px)",
    },
  },
};