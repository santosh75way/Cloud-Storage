import { Alert, Box, CircularProgress, Container, Typography, Stack } from "@mui/material";
import { PeopleAltOutlined } from "@mui/icons-material";
import { useGetSharedWithMeQuery } from "../services/sharingApi";
import { SharedItemsList } from "../components/sharing/SharedItemsList";
import { DrivePagination } from "../components/storage/DrivePagination";
import { useState } from "react";

export default function SharedWithMePage() {
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading, error } = useGetSharedWithMeQuery({ page, limit });

    const items = data?.data?.items ?? [];
    const totalPages = data?.data?.totalPages ?? 1;
    const total = data?.data?.total ?? 0;

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 4,
                animation: "fadeInUp 0.5s ease-out",
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { display: "none" },
                scrollbarWidth: "none",
                msOverflowStyle: "none"
            }}
        >
            <Stack spacing={0.5} sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            p: 1,
                            bgcolor: "rgba(99, 102, 241, 0.08)",
                            borderRadius: 2,
                            display: "flex",
                        }}
                    >
                        <PeopleAltOutlined sx={{ color: "#6366f1" }} />
                    </Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{
                            letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg, #0F172A, #334155)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Shared with me
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
                    Files and folders that others have shared with you.
                </Typography>
            </Stack>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: "#6366f1" }} />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to load shared items.
                </Alert>
            ) : (
                <Box display="flex" flexDirection="column" gap={0.5}>
                    <SharedItemsList items={items} />

                    {totalPages > 1 && (
                        <Box sx={{ flexShrink: 0, mt: 1 }}>
                            <DrivePagination
                                page={page}
                                totalPages={totalPages}
                                total={total}
                                onChange={setPage}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </Container>
    );
}
