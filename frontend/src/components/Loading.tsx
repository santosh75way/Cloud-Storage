import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.spinnerBox}>
        <CircularProgress
          size={44}
          thickness={3}
          sx={{ color: "#6366f1" }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        Loading...
      </Typography>
    </Box>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    gap: 2,
    animation: "fadeIn 0.3s ease-out",
    background: "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 50%, #F1F5F9 100%)",
  },
  spinnerBox: {
    animation: "pulse 2s ease-in-out infinite",
  },
};
