import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

type DriveExplorerLayoutProps = {
    content: ReactNode;
};

export function DriveExplorerLayout({ content }: DriveExplorerLayoutProps) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                p: { xs: 1.5, sm: 2, md: 2.5 },
                animation: "fadeIn 0.4s ease-out",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    p: { xs: 2, md: 3 },
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {content}
            </Paper>
        </Box>
    );
}