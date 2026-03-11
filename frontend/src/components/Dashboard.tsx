import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import {
  FolderOutlined,
  SearchOutlined,
  PeopleAltOutlined,
  CloudUploadOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const quickActions = [
  {
    label: "My Drive",
    description: "Browse and manage your files",
    icon: <FolderOutlined />,
    path: "/drive",
    gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
  {
    label: "Search",
    description: "Find files and folders quickly",
    icon: <SearchOutlined />,
    path: "/search",
    gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
  },
  {
    label: "Shared With Me",
    description: "View files shared by others",
    icon: <PeopleAltOutlined />,
    path: "/shared-with-me",
    gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)",
  },
  {
    label: "Upload",
    description: "Upload new files to your drive",
    icon: <CloudUploadOutlined />,
    path: "/drive",
    gradient: "linear-gradient(135deg, #10B981, #34D399)",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Box sx={{ animation: "fadeInUp 0.5s ease-out" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: "-0.02em", mb: 1 }}>
          Welcome back
          {user?.email ? `, ${user.email.split("@")[0]}` : ""}
          ! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here&apos;s a quick overview of your CloudVault workspace.
        </Typography>
      </Box>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "#475569" }}>
        Quick Actions
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2.5}
        sx={{ flexWrap: "wrap" }}
      >
        {quickActions.map((action, index) => (
          <Paper
            key={action.label}
            elevation={0}
            onClick={() => navigate(action.path)}
            sx={{
              flex: { sm: "1 1 calc(50% - 10px)", md: "1 1 calc(25% - 15px)" },
              minWidth: { sm: "calc(50% - 10px)", md: 200 },
              p: 3,
              borderRadius: 3,
              border: "1px solid #E2E8F0",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                borderColor: "transparent",
              },
            }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                background: action.gradient,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 2,
              }}
            >
              {action.icon}
            </Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
              {action.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {action.description}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Box sx={{ mt: 5, animation: "fadeIn 0.6s ease-out 0.3s both" }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={3}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                Get started with CloudVault
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your first file or create a folder to organize your workspace.
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => navigate("/drive")}
              sx={{
                flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                borderRadius: 2.5,
                px: 3,
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                },
              }}
            >
              Go to My Drive
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}