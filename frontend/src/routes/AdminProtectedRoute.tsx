import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";

type AdminProtectedRouteProps = {
    children: React.ReactNode;
};

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.auth.user);

    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
