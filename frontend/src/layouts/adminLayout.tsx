import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const DRAWER_WIDTH = 240;

const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  paddingTop: "56px",
  paddingLeft: `${DRAWER_WIDTH}px`,
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  overflowX: "hidden",
  [theme.breakpoints.up("sm")]: {
    paddingTop: "64px",
  },
}));

const AdminLayout = () => {
  return (
    <LayoutRoot>
      <AdminHeader />
      <AdminSidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </LayoutRoot>
  );
};

export default AdminLayout;
