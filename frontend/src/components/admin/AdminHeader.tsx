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
                bgcolor: "#2c5282", // A blue similar to the reference image
                color: "white",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        component="img"
                        src="https://cdn-icons-png.flaticon.com/512/3208/3208903.png"
                        alt="Logo"
                        sx={{ width: 32, height: 32, filter: "brightness(0) invert(1)" }}
                    />
                    <Typography variant="h6" fontWeight="600" noWrap>
                        Cloud Storage Dashboard
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                    <IconButton color="inherit" size="small">
                        <NotificationsIcon />
                    </IconButton>
                    <IconButton color="inherit" size="small">
                        <HelpIcon />
                    </IconButton>

                    <Box
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            cursor: "pointer",
                            ml: 1,
                            "&:hover": { opacity: 0.8 },
                        }}
                    >
                        <Typography variant="body2" fontWeight={500} sx={{ display: { xs: "none", sm: "block" } }}>
                            {user?.email?.split("@")[0] || "Admin"}
                        </Typography>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "rgba(255,255,255,0.2)" }}>
                            {user?.email?.[0]?.toUpperCase() || "A"}
                        </Avatar>
                        <KeyboardArrowDown fontSize="small" />
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        slotProps={{ paper: { sx: { mt: 1, minWidth: 150, borderRadius: 2 } } }}
                    >
                        <MenuItem onClick={handleLogout} sx={{ color: "error.main", fontWeight: 500 }}>
                            <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
