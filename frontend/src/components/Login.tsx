import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/utils/getErrorMessage";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginApi(data);
      dispatch(setCredentials(response));
      toast.success("Welcome back!");
      if (response.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Login failed. Please check your credentials."));
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.iconBox}>
            <LockOutlined sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing={-0.5}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Sign in to your CloudVault account
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
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

              <Box>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#94A3B8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <Link
                    component="button"
                    type="button"
                    variant="body2"
                    onClick={() => navigate("/forgot-password")}
                    sx={styles.forgotLink}
                  >
                    Forgot Password?
                  </Link>
                </Box>
              </Box>

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
                  "Sign In"
                )}
              </Button>

              <Box sx={{ position: "relative", my: 0.5 }}>
                <Divider>
                  <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                    OR
                  </Typography>
                </Divider>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => {
                  const API_URL = import.meta.env.VITE_API_URL;
                  window.location.href = `${API_URL}/api/auth/google`;
                }}
                startIcon={
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    width="20"
                    alt="Google"
                  />
                }
                sx={styles.socialBtn}
              >
                Continue with Google
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have an account?{" "}
              <Link
                onClick={() => navigate("/signup")}
                sx={styles.createAccountLink}
              >
                Create Account
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
  forgotLink: {
    color: "#6366f1",
    textDecoration: "none",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#4F46E5",
      textDecoration: "underline",
    },
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
  createAccountLink: {
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
  socialBtn: {
    borderRadius: 2.5,
    py: 1.25,
    borderColor: "#E2E8F0",
    borderWidth: "1.5px",
    color: "#475569",
    textTransform: "none",
    fontWeight: 600,
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#CBD5E1",
      bgcolor: "#F8FAFC",
      transform: "translateY(-1px)",
    },
  },
};
