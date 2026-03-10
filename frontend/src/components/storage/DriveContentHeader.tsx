import { Stack, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

type DriveContentHeaderProps = {
    title: string;
    breadcrumbs: ReactNode;
    actions: ReactNode;
};

export function DriveContentHeader({
    title,
    breadcrumbs,
    actions,
}: DriveContentHeaderProps) {
    return (
        <Stack spacing={2} sx={{ pb: 3, borderBottom: "1px solid #f1f5f9", mb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 2 }}>
                <Stack spacing={1}>
                    <Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-0.5px", color: "#1e293b" }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Manage folders and files in your workspace
                    </Typography>
                </Stack>

                <Box>{actions}</Box>
            </Box>

            <Box sx={{ mt: 1 }}>{breadcrumbs}</Box>
        </Stack>
    );
}