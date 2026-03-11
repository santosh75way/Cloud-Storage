import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    styled,
} from "@mui/material";
import {
    Folder as FolderIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 260;

const StyledDrawer = styled(Drawer)(() => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        paddingTop: "80px",
    },
}));

export function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "My Drive", icon: <FolderIcon />, path: "/admin/dashboard" },
    ];

    return (
        <StyledDrawer variant="permanent">
            <Box sx={{ px: 2, pt: 1 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                        px: 1.5,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                    }}
                >
                    Navigation
                </Typography>
                <List sx={{ mt: 1 }}>
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.path ||
                            location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1,
                                        px: 1.5,
                                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        bgcolor: isActive
                                            ? "rgba(99, 102, 241, 0.08)"
                                            : "transparent",
                                        color: isActive ? "#4F46E5" : "#64748B",
                                        "&:hover": {
                                            bgcolor: isActive
                                                ? "rgba(99, 102, 241, 0.12)"
                                                : "rgba(99, 102, 241, 0.04)",
                                            color: "#4F46E5",
                                            transform: "translateX(2px)",
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            color: "inherit",
                                            minWidth: 36,
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: "0.875rem",
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    />
                                    {isActive && (
                                        <Box
                                            sx={{
                                                width: 4,
                                                height: 20,
                                                bgcolor: "#6366f1",
                                                borderRadius: 2,
                                                ml: 1,
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </StyledDrawer>
    );
}
