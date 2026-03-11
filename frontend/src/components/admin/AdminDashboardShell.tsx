import { Box } from "@mui/material";
import { AdminRecentActivity } from "./AdminRecentActivity";

type AdminDashboardShellProps = {
    explorerSection: React.ReactNode;
};

export function AdminDashboardShell({ explorerSection }: AdminDashboardShellProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", lg: "row" },
                gap: 2,
                p: { xs: 1.5, sm: 2, md: 2.5 },
                animation: "fadeIn 0.4s ease-out",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                alignItems: "stretch",
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {explorerSection}
            </Box>
            <Box
                sx={{
                    flexShrink: 0,
                    width: { lg: 300 },
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                }}
            >
                <AdminRecentActivity />
            </Box>
        </Box>
    );
}
