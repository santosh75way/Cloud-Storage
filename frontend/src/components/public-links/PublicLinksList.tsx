import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
} from "@mui/material";
import { BlockOutlined } from "@mui/icons-material";
import {
    useGetPublicLinksForNodeQuery,
    useRevokePublicLinkMutation,
} from "../../services/publicLinksApi";
import { PublicLinkStatusChip } from "./PublicLinkStatusChip";
import { CopyPublicLinkButton } from "./CopyPublicLinkButton";
import { format } from "date-fns";

type Props = {
    nodeId: string;
};

export function PublicLinksList({ nodeId }: Props) {
    const { data: response, isLoading, isError } = useGetPublicLinksForNodeQuery(nodeId);
    const [revokeLink, { isLoading: isRevoking }] = useRevokePublicLinkMutation();

    if (isLoading) {
        return (
            <Box p={3} display="flex" justifyContent="center">
                <CircularProgress size={24} />
            </Box>
        );
    }

    if (isError || !response?.success) {
        return (
            <Typography color="error" variant="body2" sx={{ p: 2 }}>
                Failed to load public links.
            </Typography>
        );
    }

    const links = response.data || [];

    if (links.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: "center" }}>
                No public links generated for this item yet.
            </Typography>
        );
    }

    return (
        <List disablePadding>
            {links.map((link) => {
                const isRevoked = !link.isActive;
                const isExpired = link.expiresAt ? new Date(link.expiresAt).getTime() < Date.now() : false;

                return (
                    <ListItem
                        key={link.id}
                        divider
                        secondaryAction={
                            <Box display="flex" alignItems="center" gap={1}>
                                <CopyPublicLinkButton link={link} />
                                <Tooltip title={isRevoked ? "Already revoked" : "Revoke Link"}>
                                    <span>
                                        <IconButton
                                            edge="end"
                                            size="small"
                                            color="error"
                                            disabled={isRevoked || isExpired || isRevoking}
                                            onClick={() => revokeLink(link.id)}
                                        >
                                            <BlockOutlined fontSize="small" />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            </Box>
                        }
                    >
                        <ListItemText
                            primary={
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="body2" fontWeight={500} sx={{ fontFamily: "monospace" }}>
                                        ...{link.token.slice(-8)}
                                    </Typography>
                                    <PublicLinkStatusChip link={link} />
                                </Box>
                            }
                            secondary={
                                <Typography variant="caption" color="text.secondary">
                                    Created on {format(new Date(link.createdAt), "PPP")}
                                    {link.expiresAt && ` • Expires ${format(new Date(link.expiresAt), "PPP")}`}
                                </Typography>
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
    );
}
