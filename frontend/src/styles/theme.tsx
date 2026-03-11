import { createTheme, alpha } from "@mui/material/styles";

const INDIGO = {
  50: "#EEF2FF",
  100: "#E0E7FF",
  200: "#C7D2FE",
  300: "#A5B4FC",
  400: "#818CF8",
  500: "#6366F1",
  600: "#4F46E5",
  700: "#4338CA",
  800: "#3730A3",
  900: "#312E81",
};

export const theme = createTheme({
  palette: {
    primary: {
      main: INDIGO[500],
      light: INDIGO[100],
      dark: INDIGO[700],
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#8B5CF6",
      light: "#EDE9FE",
      dark: "#7C3AED",
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#10B981",
      light: "#D1FAE5",
      dark: "#059669",
    },
    warning: {
      main: "#F59E0B",
      light: "#FEF3C7",
      dark: "#D97706",
    },
    error: {
      main: "#EF4444",
      light: "#FEE2E2",
      dark: "#DC2626",
    },
    info: {
      main: "#3B82F6",
      light: "#DBEAFE",
      dark: "#1D4ED8",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
    action: {
      hover: alpha(INDIGO[500], 0.04),
      selected: alpha(INDIGO[500], 0.08),
      disabled: "#F1F5F9",
      disabledBackground: "#F8FAFC",
    },
  },
  typography: {
    fontFamily: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
    h1: {
      fontSize: "2.25rem",
      fontWeight: 800,
      letterSpacing: "-0.025em",
      lineHeight: 1.2,
    },
    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      lineHeight: 1.4,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      fontSize: "0.875rem",
      letterSpacing: "0.01em",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "@keyframes fadeInUp": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes slideDown": {
          from: { opacity: 0, transform: "translateY(-10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "@keyframes scaleIn": {
          from: { opacity: 0, transform: "scale(0.95)" },
          to: { opacity: 1, transform: "scale(1)" },
        },
        "@keyframes pulse": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.625rem",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.875rem",
          padding: "0.5rem 1.25rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        contained: {
          boxShadow: `0 1px 3px ${alpha(INDIGO[500], 0.3)}`,
          "&:hover": {
            boxShadow: `0 4px 14px ${alpha(INDIGO[500], 0.35)}`,
          },
        },
        outlined: {
          border: "1.5px solid #E2E8F0",
          "&:hover": {
            border: "1.5px solid #CBD5E1",
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)",
          borderRadius: "0.875rem",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "0.875rem",
          backgroundImage: "none",
        },
        outlined: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        },
        elevation1: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)",
        },
        elevation2: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
        },
        elevation3: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.625rem",
            transition: "all 0.2s ease",
            "& fieldset": {
              borderColor: "#E2E8F0",
              borderWidth: "1.5px",
              transition: "all 0.2s ease",
            },
            "&:hover fieldset": {
              borderColor: "#CBD5E1",
            },
            "&.Mui-focused fieldset": {
              borderColor: INDIGO[500],
              borderWidth: "2px",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.625rem",
          "& fieldset": {
            borderColor: "#E2E8F0",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          fontWeight: 500,
          fontSize: "0.75rem",
          transition: "all 0.2s ease",
        },
        outlined: {
          border: "1.5px solid #E2E8F0",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& thead th": {
            backgroundColor: "#F8FAFC",
            borderBottom: "2px solid #E2E8F0",
            fontWeight: 600,
            fontSize: "0.8125rem",
            letterSpacing: "0.025em",
            textTransform: "uppercase",
            color: "#64748B",
          },
          "& tbody tr": {
            borderBottom: "1px solid #F1F5F9",
            transition: "all 0.15s ease",
            "&:hover": {
              backgroundColor: alpha(INDIGO[500], 0.02),
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#F1F5F9",
          padding: "0.875rem 1rem",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#F8FAFC",
          color: "#64748B",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          height: "6px",
          backgroundColor: "#E2E8F0",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "0.625rem",
          border: "1px solid",
        },
        standardInfo: {
          backgroundColor: "#DBEAFE",
          color: "#1D4ED8",
          borderColor: "#93C5FD",
        },
        standardSuccess: {
          backgroundColor: "#D1FAE5",
          color: "#059669",
          borderColor: "#A7F3D0",
        },
        standardWarning: {
          backgroundColor: "#FEF3C7",
          color: "#D97706",
          borderColor: "#FCD34D",
        },
        standardError: {
          backgroundColor: "#FEE2E2",
          color: "#DC2626",
          borderColor: "#FECACA",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "#64748B",
          "&:hover": {
            backgroundColor: alpha(INDIGO[500], 0.06),
            color: INDIGO[600],
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FFFFFF",
          borderRight: "1px solid #E2E8F0",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "0.75rem",
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          margin: "0.25rem 0.5rem",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: alpha(INDIGO[500], 0.06),
          },
          "&.Mui-selected": {
            backgroundColor: alpha(INDIGO[500], 0.08),
            "&:hover": {
              backgroundColor: alpha(INDIGO[500], 0.12),
            },
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.875rem",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "1rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "1.125rem",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: "0.5rem",
          fontSize: "0.75rem",
          fontWeight: 500,
          backgroundColor: "#1E293B",
          padding: "0.375rem 0.75rem",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          "& .MuiPaginationItem-root": {
            borderRadius: "0.5rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          transition: "all 0.2s ease",
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          "& .MuiBreadcrumbs-separator": {
            color: "#94A3B8",
          },
        },
      },
    },
  },
});

export default theme;