import { Box, Card, Typography, Divider, Avatar, CircularProgress, Alert, Pagination } from "@mui/material";
import { Description as FileIcon, Image as ImageIcon } from "@mui/icons-material";
import { useGetRecentSharesQuery, useGetActivityFeedQuery } from "../../services/adminApi";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export function AdminRecentActivity() {
    const [sharesPage, setSharesPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);

    const { data: sharesRes, isLoading: isSharesLoading, error: sharesError } = useGetRecentSharesQuery({ page: sharesPage, limit: 3 });
    const { data: activityRes, isLoading: isActivityLoading, error: activityError } = useGetActivityFeedQuery({ page: activityPage, limit: 5 });

    const sharesData = sharesRes?.data;
    const shares = sharesData?.items || [];

    const activityData = activityRes?.data;
    const activities = activityData?.items || [];

    const getFileIcon = (type: string) => {
        if (type === "FILE") return <FileIcon sx={{ fontSize: 16 }} />;
        return <ImageIcon sx={{ fontSize: 16 }} />;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                flex: 1,
                minHeight: 0,
            }}
        >
            {/* Shared Files Card */}
            <Card
                sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #E2E8F0",
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    animation: "fadeInUp 0.5s ease-out 0.1s both",
                }}
            >
                <Typography variant="subtitle2" fontWeight={700} mb={1.5} fontSize="0.85rem">
                    Shared Files
                </Typography>
                {isSharesLoading ? (
                    <Box display="flex" justifyContent="center" p={1}>
                        <CircularProgress size={20} sx={{ color: "#6366f1" }} />
                    </Box>
                ) : sharesError ? (
                    <Alert severity="error" sx={{ py: 0 }}>Failed to load shares.</Alert>
                ) : shares.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No recent files shared.</Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {shares.map((share, idx) => (
                            <Box
                                key={share.id}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 1.5,
                                    pb: idx !== shares.length - 1 ? 1.5 : 0,
                                    borderBottom: idx !== shares.length - 1 ? "1px solid #F1F5F9" : "none",
                                }}
                            >
                                <Box
                                    sx={{
                                        background: "linear-gradient(135deg, #6366f1, #818cf8)",
                                        color: "white",
                                        p: 0.75,
                                        borderRadius: 1.5,
                                        display: "flex",
                                        flexShrink: 0,
                                    }}
                                >
                                    {getFileIcon(share.node.type)}
                                </Box>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        display="block"
                                        sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                    >
                                        {share.node.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: "0.7rem" }}>
                                        {share.sharedByUser.fullName} → {share.sharedWithUser.fullName}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        {sharesData && sharesData.totalPages > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                                <Pagination
                                    count={sharesData.totalPages}
                                    page={sharesPage}
                                    onChange={(_, page) => setSharesPage(page)}
                                    shape="rounded"
                                    color="primary"
                                    size="small"
                                    siblingCount={0}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </Card>

            {/* Activity Feed Card */}
            <Card
                sx={{
                    p: 2,
                    borderRadius: 2.5,
                    border: "1px solid #E2E8F0",
                    flex: 1,
                    minHeight: 0,
                    overflow: "auto",
                    animation: "fadeInUp 0.5s ease-out 0.2s both",
                }}
            >
                <Typography variant="subtitle2" fontWeight={700} mb={1} fontSize="0.85rem">
                    Activity Feed
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                {isActivityLoading ? (
                    <Box display="flex" justifyContent="center" p={1}>
                        <CircularProgress size={20} sx={{ color: "#6366f1" }} />
                    </Box>
                ) : activityError ? (
                    <Alert severity="error" sx={{ py: 0 }}>Failed to load activity.</Alert>
                ) : activities.length === 0 ? (
                    <Typography variant="caption" color="text.secondary">No recent activity.</Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {activities.map((act) => (
                            <Box
                                key={act.id}
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    p: 0.25,
                                    borderRadius: 1,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 26,
                                        height: 26,
                                        background: act.type === "SHARE_CREATED"
                                            ? "linear-gradient(135deg, #6366f1, #818cf8)"
                                            : "linear-gradient(135deg, #10b981, #34d399)",
                                        fontSize: "0.7rem",
                                        flexShrink: 0,
                                    }}
                                >
                                    {act.actor.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="caption" sx={{ wordBreak: "break-word", lineHeight: 1.4, display: "block" }}>
                                        <b>{act.actor}</b>{" "}
                                        {act.type === "SHARE_CREATED" ? "shared" : "created"}{" "}
                                        <Typography component="span" color="primary" variant="caption" sx={{ fontWeight: 500 }}>
                                            &quot;{act.target}&quot;
                                        </Typography>
                                        {act.type === "SHARE_CREATED" && act.targetUser && ` with ${act.targetUser}`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem" }}>
                                        {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        {activityData && activityData.totalPages > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
                                <Pagination
                                    count={activityData.totalPages}
                                    page={activityPage}
                                    onChange={(_, page) => setActivityPage(page)}
                                    shape="rounded"
                                    color="primary"
                                    size="small"
                                    siblingCount={0}
                                />
                            </Box>
                        )}
                    </Box>
                )}
            </Card>
        </Box>
    );
}
