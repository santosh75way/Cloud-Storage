import { Box } from "@mui/material";
import { AdminRecentActivity } from "./AdminRecentActivity";

type AdminDashboardShellProps = {
    explorerSection: React.ReactNode;
};

export function AdminDashboardShell({ explorerSection }: AdminDashboardShellProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Top Row: Explorer and Recent Activity */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 3,
                    alignItems: "flex-start"
                }}
            >
                <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%" }}>
                    {explorerSection}
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <AdminRecentActivity />
                </Box>
            </Box>
        </Box>
    );
}
