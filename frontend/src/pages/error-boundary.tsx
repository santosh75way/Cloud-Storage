import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { Container, Paper, Stack, Typography, Button, Box } from "@mui/material";
import { Home as HomeIcon, ArrowBack as ArrowBackIcon, ErrorOutline as ErrorIcon } from "@mui/icons-material";

const getErrorTitle = (status?: number): string => {
  switch (status) {
    case 400:
      return "Bad Request";
    case 401:
      return "Authentication Required";
    case 403:
      return "Access Denied";
    case 404:
      return "Page Not Found";
    case 500:
      return "Server Error";
    default:
      return "Unexpected Error";
  }
};

const getErrorMessage = (status?: number, statusText?: string): string => {
  if (statusText) return statusText;

  switch (status) {
    case 400:
      return "The request could not be understood by the server.";
    case 401:
      return "Please log in to access this page.";
    case 403:
      return "You do not have permission to view this resource.";
    case 404:
      return "The page you are looking for does not exist or has been moved.";
    case 500:
      return "Our servers encountered an unexpected issue. Please try again later.";
    default:
      return "An unexpected error occurred while loading this page. Please try again.";
  }
};

export default function ErrorBoundaryPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let status: number | undefined;
  let title = "Unexpected Error";
  let displayMessage = "An unexpected error occurred while loading this page. Please try again.";

  if (isRouteErrorResponse(error)) {
    const routeMessage =
      typeof error.data === "string"
        ? error.data
        : typeof error.data === "object" &&
          error.data !== null &&
          "message" in error.data &&
          typeof error.data.message === "string"
          ? error.data.message
          : undefined;

    status = error.status;
    title = getErrorTitle(status);
    displayMessage = getErrorMessage(status, error.statusText || routeMessage);
  } else if (error instanceof Error) {
    title = "Something went wrong";
    displayMessage = error.message || displayMessage;
  } else if (typeof error === "string") {
    title = "Something went wrong";
    displayMessage = error;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 5, borderRadius: 3, textAlign: "center", width: "100%" }}>
        <Box sx={{ mb: 3 }}>
          <ErrorIcon color="error" sx={{ fontSize: 64, mb: 1.5 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {status ? `${status} - ${title}` : title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 2 }}>
            {displayMessage}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/")}
            sx={{ borderRadius: 2, fontWeight: 700 }}
            disableElevation
          >
            Go Home
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}