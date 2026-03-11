import { DescriptionOutlined, FolderOutlined, LinkOutlined } from "@mui/icons-material";
import {
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
    Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { StorageNode } from "../../types/storage";
import { DeleteNodeButton } from "./DeleteNodeButton";
import { RenameNodeButton } from "./RenameNodeButton";
import { OpenFileButton } from "./OpenFileButton";
import { Alert } from "@mui/material";
import { ShareOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { ShareNodeDialog } from "../sharing/ShareNodeDialog";
import { CreatePublicLinkDialog } from "../public-links/CreatePublicLinkDialog";
import { PermissionGuard } from "./PermissionGuard";

type DriveNodeRowProps = {
    item: StorageNode;
};

export function DriveNodeRow({ item }: DriveNodeRowProps) {
    const navigate = useNavigate();
    const [localError, setLocalError] = useState<string | null>(null);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [publicLinkDialogOpen, setPublicLinkDialogOpen] = useState(false);

    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    const isAdmin = userRole === "ADMIN";

    const handleOpen = () => {
        if (item.type === "FOLDER") {
            navigate(`/drive/${item.id}`);
        }
    };

    const isFolder = item.type === "FOLDER";
    const secondaryText = isFolder ? "Folder" : "File";

    return (
        <>
            {localError ? (
                <Alert severity="error" onClose={() => setLocalError(null)} sx={{ mb: 1, borderRadius: 2 }}>
                    {localError}
                </Alert>
            ) : null}
            <ListItem
                divider
                secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                        {isAdmin && (
                            <>
                                <Tooltip title="Public Links">
                                    <IconButton
                                        onClick={(e) => { e.stopPropagation(); setPublicLinkDialogOpen(true); }}
                                        size="small"
                                    >
                                        <LinkOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share">
                                    <IconButton
                                        onClick={(e) => { e.stopPropagation(); setShareDialogOpen(true); }}
                                        size="small"
                                    >
                                        <ShareOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                        {item.type === "FILE" ? <OpenFileButton node={item} onError={setLocalError} /> : null}
                        <PermissionGuard requiredLevel="EDIT" nodeAccess={item.accessLevel}>
                            <RenameNodeButton node={item} />
                            <DeleteNodeButton node={item} />
                        </PermissionGuard>
                    </Stack>
                }
                onClick={handleOpen}
                sx={{
                    cursor: isFolder ? "pointer" : "default",
                    borderRadius: 2,
                    mx: 0.5,
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderBottom: "1px solid #F1F5F9",
                    "&:hover": {
                        bgcolor: "rgba(99, 102, 241, 0.03)",
                    },
                }}
            >
                <ListItemIcon sx={{ minWidth: 42 }}>
                    <Box
                        sx={{
                            p: 0.75,
                            borderRadius: 1.5,
                            display: "flex",
                            bgcolor: isFolder ? "rgba(245, 158, 11, 0.08)" : "rgba(99, 102, 241, 0.06)",
                        }}
                    >
                        {isFolder ? (
                            <FolderOutlined sx={{ color: "#F59E0B" }} />
                        ) : (
                            <DescriptionOutlined sx={{ color: "#6366f1" }} />
                        )}
                    </Box>
                </ListItemIcon>

                <ListItemText
                    primary={item.name}
                    secondary={secondaryText}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: "0.875rem" }}
                    secondaryTypographyProps={{ fontSize: "0.75rem" }}
                />
            </ListItem>

            {isAdmin && (
                <>
                    <ShareNodeDialog
                        open={shareDialogOpen}
                        onClose={() => setShareDialogOpen(false)}
                        node={item}
                    />
                    <CreatePublicLinkDialog
                        open={publicLinkDialogOpen}
                        onClose={() => setPublicLinkDialogOpen(false)}
                        node={item}
                    />
                </>
            )}
        </>
    );
}