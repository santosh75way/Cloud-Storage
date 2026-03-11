import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { googleLogin } from "@/services/api";
import { setCredentials } from "@/store/authSlice";
import { toast } from "react-toastify";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function GoogleCall() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasCalled = useRef(false);

  const code = searchParams.get("code");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const userStr = searchParams.get("user");

  useEffect(() => {
    const handleCallback = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      // Flow 1: We got tokens directly from a redirect
      if (accessToken && refreshToken && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));
          dispatch(setCredentials({ user, accessToken, refreshToken }));
          toast.success("Successfully logged in with Google!");
          navigate("/dashboard");
          return;
        } catch (e) {
          console.error("Failed to parse user data from redirect", e);
        }
      }

      // Flow 2: We got a code and need to exchange it
      if (code) {
        try {
          const response = await googleLogin(code);
          dispatch(setCredentials(response));
          toast.success("Successfully logged in with Google!");
          navigate("/dashboard");
        } catch (error: unknown) {
          toast.error(getErrorMessage(error, "Google authentication failed"));
          navigate("/login");
        }
        return;
      }

      // No markers found
      if (!code && !accessToken) {
        toast.error("Google authentication failed: missing data");
        navigate("/login");
      }
    };

    handleCallback();
  }, [code, accessToken, refreshToken, userStr, navigate, dispatch]);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.content}>
        <Box sx={styles.spinnerBox}>
          <CircularProgress
            size={48}
            thickness={3}
            sx={{ color: "#6366f1" }}
          />
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Authenticating with Google
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we securely sign you in...
        </Typography>
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F1F5F9 100%)",
  },
  content: {
    textAlign: "center",
    animation: "fadeIn 0.5s ease-out",
  },
  spinnerBox: {
    mb: 3,
    animation: "pulse 2s ease-in-out infinite",
  },
};
