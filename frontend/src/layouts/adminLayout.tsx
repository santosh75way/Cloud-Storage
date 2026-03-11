import { Box, styled } from "@mui/material";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";



const LayoutRoot = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  overflow: "hidden",
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  height: "100vh",
  paddingTop: "64px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  animation: "fadeIn 0.4s ease-out",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "56px",
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
