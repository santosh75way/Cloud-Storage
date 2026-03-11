import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Link,
  CircularProgress,
  Stack,
  InputAdornment,
} from "@mui/material";
import { EmailOutlined, LockResetOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword({ email: data.email });
      toast.success("Password reset link has been sent to your email!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to send reset link."));
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.iconBox}>
            <LockResetOutlined sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing={-0.5}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Enter your email to receive a reset link
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Enter your email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                sx={styles.submitButton}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{" "}
              <Link onClick={() => navigate("/login")} sx={styles.signInLink}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const styles = {
  mainContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    py: 4,
    background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F1F5F9 100%)",
  },
  paper: {
    p: { xs: 4, sm: 5 },
    borderRadius: 4,
    textAlign: "center",
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(226, 232, 240, 0.6)",
    boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.02)",
    animation: "fadeInUp 0.5s ease-out",
  },
  iconBox: {
    width: 56,
    height: 56,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mx: "auto",
    mb: 3,
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
  },
  submitButton: {
    py: 1.5,
    borderRadius: 2.5,
    fontWeight: 700,
    textTransform: "none",
    fontSize: "0.9375rem",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
      boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
      transform: "translateY(-1px)",
    },
  },
  signInLink: {
    cursor: "pointer",
    fontWeight: 700,
    color: "#6366f1",
    textDecoration: "none",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#4F46E5",
      textDecoration: "underline",
    },
  },
};
