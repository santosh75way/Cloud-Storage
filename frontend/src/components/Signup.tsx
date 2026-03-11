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
  Stack,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/utils/getErrorMessage";

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "STAFF"]),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "USER",
      fullName: "",
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await signupApi(data);
      dispatch(setCredentials(response));
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Signup failed. Please try again."));
    }
  };

  return (
    <Box sx={styles.mainContainer}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={styles.paper}>
          <Box sx={styles.iconBox}>
            <PersonOutline sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography variant="h4" fontWeight={800} gutterBottom letterSpacing={-0.5}>
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>
            Join CloudVault and start storing
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Full Name"
                placeholder="Enter your full name"
                {...register("fullName")}
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#94A3B8" }} />
                    </InputAdornment>
                  ),
                }}
              />

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
                  "Create Account"
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
                Sign up with Google
              </Button>
            </Stack>
          </form>

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
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
