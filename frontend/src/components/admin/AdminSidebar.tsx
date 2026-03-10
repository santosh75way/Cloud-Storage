import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, styled } from "@mui/material";
import { Folder as FolderIcon } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const DRAWER_WIDTH = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: DRAWER_WIDTH,
        boxSizing: "border-box",
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(3),
    },
}));

const SidebarContainer = styled(Box)({
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
});

const StyledList = styled(List)(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
    marginBottom: theme.spacing(0.5),
}));

const StyledListItemButton = styled(ListItemButton)<{ isactive: string }>(({ theme, isactive }) => ({
    borderRadius: "6px",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: isactive === "true" ? theme.palette.action.selected : "transparent",
    color: isactive === "true" ? theme.palette.text.primary : theme.palette.text.secondary,
    "&:hover": {
        backgroundColor: isactive === "true" ? theme.palette.action.selected : theme.palette.action.hover,
    },
}));

const StyledListItemIcon = styled(ListItemIcon)({
    color: "inherit",
    minWidth: 40,
});

const Spacer = styled(Box)({
    flexGrow: 1,
});

export function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: "My Drive", icon: <FolderIcon />, path: "/admin/dashboard" },
    ];

    return (
        <StyledDrawer variant="permanent">
            <SidebarContainer>
                <StyledList>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path === "/admin/dashboard" && location.pathname.startsWith("/admin/dashboard"));
                        return (
                            <StyledListItem key={item.label} disablePadding>
                                <StyledListItemButton
                                    onClick={() => navigate(item.path)}
                                    isactive={isActive.toString()}
                                >
                                    <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: "0.875rem",
                                            fontWeight: isActive ? 600 : 500,
                                        }}
                                    />
                                </StyledListItemButton>
                            </StyledListItem>
                        );
                    })}
                </StyledList>

                <Spacer />

            </SidebarContainer>
        </StyledDrawer>
    );
}
