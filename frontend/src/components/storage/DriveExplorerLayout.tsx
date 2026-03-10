import { Box, Paper } from "@mui/material";
import type { ReactNode } from "react";

type DriveExplorerLayoutProps = {
    content: ReactNode;
};

export function DriveExplorerLayout({ content }: DriveExplorerLayoutProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: { xs: 2, sm: 3, md: 4 } }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    p: { xs: 2, md: 4 },
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    minHeight: "60vh"
                }}
            >
                {content}
            </Paper>
        </Box>
    );
}