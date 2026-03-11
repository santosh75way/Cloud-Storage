import { Box, Button, Container, Typography } from "@mui/material";
import { SentimentDissatisfiedOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box sx={styles.wrapper}>
        <Typography
          variant="h1"
          sx={styles.bigNumber}
        >
          404
        </Typography>

        <SentimentDissatisfiedOutlined sx={styles.icon} />

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Page not found
        </Typography>

        <Typography variant="body1" sx={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/dashboard")}
          sx={styles.button}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
}

const styles = {
  wrapper: {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    animation: "fadeInUp 0.5s ease-out",
  },
  bigNumber: {
    fontSize: { xs: "6rem", md: "8rem" },
    fontWeight: 900,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1,
    mb: 2,
  },
  icon: {
    fontSize: 48,
    color: "#94A3B8",
    mb: 2,
  },
  description: {
    color: "text.secondary",
    maxWidth: 380,
    mb: 4,
    lineHeight: 1.6,
  },
  button: {
    borderRadius: 2.5,
    px: 4,
    py: 1.25,
    fontWeight: 600,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
      transform: "translateY(-1px)",
    },
  },
};
