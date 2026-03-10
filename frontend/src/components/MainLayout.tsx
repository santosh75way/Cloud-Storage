import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  styled
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";

const drawerWidth = 260;

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    boxSizing: "border-box",
    borderRight: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

const LogoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const LogoIcon = styled(DashboardIcon)({
  color: "#FFFFFF",
});

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  color: theme.palette.text.primary,
  letterSpacing: "-0.02em",
}));

const DrawerContentContainer = styled(Box)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const StyledList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const StyledListItemButton = styled(ListItemButton)<{ isactive: string }>(({ theme, isactive }) => ({
  borderRadius: "6px",
  marginBottom: theme.spacing(0.5),
  paddingTop: theme.spacing(1.2),
  paddingBottom: theme.spacing(1.2),
  backgroundColor: isactive === "true" ? theme.palette.action.selected : "transparent",
  color: isactive === "true" ? theme.palette.text.primary : theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: 40,
  color: "inherit",
});

const FooterBox = styled(Box)(({ theme }) => ({
  marginTop: "auto",
  paddingBottom: theme.spacing(4),
}));

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const LogoutButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: "6px",
  color: theme.palette.error.main,
  "&:hover": {
    backgroundColor: theme.palette.error.light,
  },
}));

const MainContentWrapper = styled("main")({
  flexGrow: 1,
  padding: 0,
  overflowY: "auto",
});

const OutletBox = styled(Box)({
  minHeight: "100vh",
  transition: "0.3s",
});

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Profile Settings", icon: <ProfileIcon />, path: "/profile/user" },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <LayoutRoot>
      <StyledDrawer variant="permanent">
        <StyledToolbar>
          <LogoContainer>
            <LogoBox>
              <LogoIcon />
            </LogoBox>
            <LogoText variant="h6">
              Scheduler
            </LogoText>
          </LogoContainer>
        </StyledToolbar>

        <DrawerContentContainer>
          <StyledList>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <StyledListItemButton
                    isactive={isActive.toString()}
                    onClick={() => navigate(item.path)}
                  >
                    <StyledListItemIcon>
                      {item.icon}
                    </StyledListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  </StyledListItemButton>
                </ListItem>
              );
            })}
          </StyledList>

          <FooterBox>
            <StyledDivider />
            <LogoutButton onClick={handleLogout}>
              <StyledListItemIcon>
                <LogoutIcon />
              </StyledListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </LogoutButton>
          </FooterBox>
        </DrawerContentContainer>
      </StyledDrawer>

      <MainContentWrapper>
        <OutletBox>
          <Outlet />
        </OutletBox>
      </MainContentWrapper>
    </LayoutRoot>
  );
}
