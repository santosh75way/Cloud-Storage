import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "@/services/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Box sx={styles.mainContainer}>
        <Container maxWidth="xs">
          <Paper elevation={0} sx={styles.paper}>
            <Box sx={{ ...styles.iconBox, background: "linear-gradient(135deg, #EF4444, #DC2626)" }}>
              <LockOutlined sx={{ fontSize: 28, color: "#fff" }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="error" gutterBottom>
              Invalid Reset Link
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              The password reset link is invalid or has expired.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={styles.submitButton}
              onClick={() => navigate("/forgot-password")}
            >
              Request New Link
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.iconBox}>
            <LockOpenOutlined sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing={-0.5}>
            New Password
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Enter your new password to secure your account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="password"
                label="New Password"
                placeholder="••••••••"
                {...register("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                size="large"
                variant="contained"
                type="submit"
                disabled={loading}
                sx={styles.submitButton}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </Stack>
          </form>
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
};
