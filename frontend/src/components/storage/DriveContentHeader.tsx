import { Typography, Box } from "@mui/material";
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
        <Box sx={{ pb: 2, borderBottom: "1px solid #F1F5F9", mb: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 1,
                }}
            >
                <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                        letterSpacing: "-0.02em",
                        background: "linear-gradient(135deg, #0F172A, #334155)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {title}
                </Typography>

                <Box>{actions}</Box>
            </Box>

            <Box>{breadcrumbs}</Box>
        </Box>
    );
}