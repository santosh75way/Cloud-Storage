import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Tooltip,
    CircularProgress,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import { PersonOutline, DeleteOutline } from "@mui/icons-material";
import { PermissionBadge } from "./PermissionBadge";
import { SharePermissionSelect } from "./SharePermissionSelect";
import {
    useGetSharesForNodeQuery,
    useUpdateShareMutation,
    useDeleteShareMutation,
} from "../../services/sharingApi";
import type { StorageNode } from "../../types/storage";
import type { SharePermission } from "../../types/sharing";
import { DrivePagination } from "../storage/DrivePagination";
import { useState } from "react";

type NodeSharesListProps = {
    node: StorageNode;
};

export function NodeSharesList({ node }: NodeSharesListProps) {
    const [page, setPage] = useState(1);
    const limit = 3;

    const { data, isLoading, error } = useGetSharesForNodeQuery({ nodeId: node.id, page, limit });
    const [updateShare] = useUpdateShareMutation();
    const [deleteShare] = useDeleteShareMutation();

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Failed to load shares.</Alert>;
    }

    const shares = data?.data?.items ?? [];
    const totalPages = data?.data?.totalPages ?? 1;
    const total = data?.data?.total ?? 0;

    return (
        <Box display="flex" flexDirection="column">
            <List>
                {/* Node Owner Row */}
                <ListItem divider>
                    <ListItemAvatar>
                        <Avatar>
                            <PersonOutline />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Owner"
                        secondary={node.ownerId}
                        secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                    />
                    <PermissionBadge permission="OWNER" />
                </ListItem>

                {/* Share Records */}
                {shares.map((share) => (
                    <ListItem key={share.id} divider>
                        <ListItemAvatar>
                            <Avatar>
                                <PersonOutline />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Shared User"
                            secondary={share.sharedWithUserId}
                            secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                        />

                        <Box display="flex" alignItems="center" gap={1}>
                            <SharePermissionSelect
                                value={share.permission}
                                onChange={(newPermission: SharePermission) => {
                                    void updateShare({
                                        shareId: share.id,
                                        nodeId: node.id,
                                        body: { permission: newPermission },
                                    });
                                }}
                            />
                            <Tooltip title="Remove share">
                                <IconButton
                                    edge="end"
                                    color="error"
                                    onClick={() => {
                                        void deleteShare({ shareId: share.id, nodeId: node.id });
                                    }}
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </ListItem>
                ))}

                {shares.length === 0 && (
                    <Box p={2} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Not shared with any other users.
                        </Typography>
                    </Box>
                )}
            </List>

            {totalPages > 1 && (
                <Box p={1}>
                    <DrivePagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        onChange={setPage}
                    />
                </Box>
            )}
        </Box>
    );
}
