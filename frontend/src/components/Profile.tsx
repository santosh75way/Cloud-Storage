import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Save as SaveIcon,
  Lock as LockIcon,
  PhotoCamera as PhotoCameraIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { getProfile, updateProfile, changePassword } from "@/services/api";
import { type User } from "@/libs/types";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";
import { getErrorMessage } from "@/utils/getErrorMessage";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);
  const dispatch = useDispatch();

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data);
      resetProfile({ fullName: data.fullName });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to fetch profile"));
    } finally {
      setLoading(false);
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      const updatedUser = await updateProfile(data);
      setUser(updatedUser);
      dispatch(setAuth({ user: updatedUser }));
      toast.success("Profile updated successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      resetPassword();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to change password"));
    }
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={{ mb: 4, animation: "fadeInUp 0.4s ease-out" }}>
        <Typography variant="h3" fontWeight={800} gutterBottom sx={styles.title}>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update your personal information and security settings.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
        {/* Profile Card */}
        <Paper
          elevation={0}
          sx={{
            ...styles.profileCard,
            width: { xs: "100%", md: "320px" },
            flexShrink: 0,
            animation: "fadeInUp 0.5s ease-out 0.1s both",
          }}
        >
          <Box sx={styles.avatarWrapper}>
            <Avatar src={user?.avatarUrl} sx={styles.avatar}>
              {user?.fullName?.[0]}
            </Avatar>
            <IconButton sx={styles.uploadBtn} size="small">
              <PhotoCameraIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="h6" fontWeight={700} align="center" sx={{ mt: 2 }}>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {user?.role}
          </Typography>
          <Divider sx={{ width: "100%", mb: 3 }} />
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <EmailIcon sx={{ color: "#94A3B8", fontSize: 18 }} />
              <Typography variant="body2">{user?.email}</Typography>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={1.5}
            >
              <Box display="flex" alignItems="center" gap={1.5} sx={{ overflow: "hidden" }}>
                <PersonIcon sx={{ color: "#94A3B8", fontSize: 18, flexShrink: 0 }} />
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {user?.id}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleCopyId}
                sx={{ color: copiedId ? "success.main" : "#94A3B8", transition: "color 0.2s ease" }}
              >
                {copiedId ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Stack>
        </Paper>

        {/* Form Cards */}
        <Stack spacing={3} sx={{ flexGrow: 1, width: "100%" }}>
          <Paper
            elevation={0}
            sx={{ ...styles.formCard, animation: "fadeInUp 0.5s ease-out 0.2s both" }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={handleProfileSubmit(onProfileSubmit)} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...registerProfile("fullName")}
                  error={!!profileErrors.fullName}
                  helperText={profileErrors.fullName?.message}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  value={user?.email}
                  disabled
                  helperText="Email cannot be changed"
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isProfileSubmitting}
                    sx={styles.saveBtn}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{ ...styles.formCard, animation: "fadeInUp 0.5s ease-out 0.3s both" }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Security Settings
            </Typography>
            <Box
              component="form"
              onSubmit={handlePasswordSubmit(onPasswordSubmit)}
              sx={{ mt: 3 }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  {...registerPassword("oldPassword")}
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword?.message}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    {...registerPassword("newPassword")}
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword?.message}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm New Password"
                    {...registerPassword("confirmPassword")}
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword?.message}
                  />
                </Stack>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<LockIcon />}
                    disabled={isPasswordSubmitting}
                    sx={styles.saveBtn}
                  >
                    Change Password
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
}

const styles = {
  container: {
    maxWidth: 1100,
    mx: "auto",
    p: 2,
  },
  title: {
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #0F172A, #334155)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  profileCard: {
    p: 4,
    borderRadius: 3,
    border: "1px solid #E2E8F0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
    },
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    fontSize: "2.5rem",
    fontWeight: 700,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  uploadBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    bgcolor: "white",
    border: "2px solid #E2E8F0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    "&:hover": { bgcolor: "#F8FAFC", borderColor: "#CBD5E1" },
  },
  formCard: {
    p: 4,
    borderRadius: 3,
    border: "1px solid #E2E8F0",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
    },
  },
  saveBtn: {
    borderRadius: 2.5,
    textTransform: "none",
    fontWeight: 600,
    px: 3,
    minWidth: 160,
    transition: "all 0.2s ease",
  },
};
