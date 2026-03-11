import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Notifications as NotificationsIcon,
    HelpOutline as HelpIcon,
    KeyboardArrowDown,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";

export function AdminHeader() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                background: "linear-gradient(135deg, #312E81 0%, #4338CA 50%, #3730A3 100%)",
                color: "white",
                zIndex: (theme) => theme.zIndex.drawer + 1,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                animation: "slideDown 0.3s ease-out",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            background: "rgba(255, 255, 255, 0.15)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.25rem",
                        }}
                    >
                        ☁
                    </Box>
                    <Typography variant="h6" fontWeight={700} noWrap letterSpacing={-0.3}>
                        CloudVault Admin
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                color: "#fff",
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                        size="small"
                    >
                        <NotificationsIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        sx={{
                            color: "rgba(255, 255, 255, 0.7)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                color: "#fff",
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                        size="small"
                    >
                        <HelpIcon fontSize="small" />
                    </IconButton>

                    <Box
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            ml: 1,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                                display: { xs: "none", sm: "block" },
                                color: "rgba(255, 255, 255, 0.9)",
                            }}
                        >
                            {user?.email?.split("@")[0] || "Admin"}
                        </Typography>
                        <Avatar
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "rgba(255, 255, 255, 0.2)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                            }}
                        >
                            {user?.email?.[0]?.toUpperCase() || "A"}
                        </Avatar>
                        <KeyboardArrowDown fontSize="small" sx={{ color: "rgba(255, 255, 255, 0.6)" }} />
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        slotProps={{
                            paper: {
                                sx: {
                                    mt: 1,
                                    minWidth: 180,
                                    borderRadius: 3,
                                    border: "1px solid #E2E8F0",
                                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
                                },
                            },
                        }}
                    >
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                color: "error.main",
                                fontWeight: 500,
                                borderRadius: 2,
                                mx: 1,
                                "&:hover": { bgcolor: "#FEF2F2" },
                            }}
                        >
                            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
