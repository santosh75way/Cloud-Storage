import { Box, Card, Typography, Divider, Avatar, CircularProgress, Alert, Pagination } from "@mui/material";
import { Description as FileIcon, Image as ImageIcon } from "@mui/icons-material";
import { useGetRecentSharesQuery, useGetActivityFeedQuery } from "../../services/adminApi";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

export function AdminRecentActivity() {
    const [sharesPage, setSharesPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);

    const { data: sharesRes, isLoading: isSharesLoading, error: sharesError } = useGetRecentSharesQuery({ page: sharesPage, limit: 5 });
    const { data: activityRes, isLoading: isActivityLoading, error: activityError } = useGetActivityFeedQuery({ page: activityPage, limit: 10 });

    const sharesData = sharesRes?.data;
    const shares = sharesData?.items || [];

    const activityData = activityRes?.data;
    const activities = activityData?.items || [];

    const getFileIcon = (type: string) => {
        if (type === "FILE") return <FileIcon fontSize="small" />;
        return <ImageIcon fontSize="small" />;
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: { xs: "100%", lg: 320 } }}>
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Typography variant="h6" fontWeight="700" mb={2} fontSize="1.1rem">
                    Shared Files
                </Typography>
                {isSharesLoading ? (
                    <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} /></Box>
                ) : sharesError ? (
                    <Alert severity="error">Failed to load shares.</Alert>
                ) : shares.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No recent files shared.</Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {shares.map((share, idx) => (
                            <Box key={share.id} sx={{ display: "flex", alignItems: "flex-start", gap: 2, pb: idx !== shares.length - 1 ? 2 : 0, borderBottom: idx !== shares.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                                <Box sx={{ bgcolor: "#3b82f6", color: "white", p: 1, borderRadius: 1, display: "flex" }}>
                                    {getFileIcon(share.node.type)}
                                </Box>
                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight="600" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {share.node.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Shared by {share.sharedByUser.fullName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        With {share.sharedWithUser.fullName}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ cursor: "pointer" }}>&gt;</Typography>
                            </Box>
                        ))}
                        {sharesData && sharesData.totalPages > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
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

            <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Typography variant="h6" fontWeight="700" mb={2} fontSize="1.1rem">
                    Activity Feed
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {isActivityLoading ? (
                    <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} /></Box>
                ) : activityError ? (
                    <Alert severity="error">Failed to load activity.</Alert>
                ) : activities.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">No recent activity.</Typography>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        {activities.map((act) => (
                            <Box key={act.id} sx={{ display: "flex", gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: act.type === "SHARE_CREATED" ? "#3b82f6" : "#10b981", fontSize: "0.875rem" }}>
                                    {act.actor.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                                        <b>{act.actor}</b> {act.type === "SHARE_CREATED" ? "shared" : "created"} <Typography component="span" color="primary" variant="body2" sx={{ cursor: "pointer" }}>"{act.target}"</Typography>
                                        {act.type === "SHARE_CREATED" && act.targetUser && ` with ${act.targetUser}`}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(act.timestamp), { addSuffix: true })}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                        {activityData && activityData.totalPages > 1 && (
                            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
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
