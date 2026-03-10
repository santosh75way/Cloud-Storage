import { DescriptionOutlined, FolderOutlined, LinkOutlined } from "@mui/icons-material";
import {
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Tooltip,
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

    const secondaryText = item.type === "FOLDER" ? "Folder" : "File";

    return (
        <>
            {localError ? (
                <Alert severity="error" onClose={() => setLocalError(null)} sx={{ mb: 1 }}>
                    {localError}
                </Alert>
            ) : null}
            <ListItem
                divider
                secondaryAction={
                    <Stack direction="row" spacing={1}>
                        {isAdmin && (
                            <>
                                <Tooltip title="Public Links">
                                    <IconButton onClick={(e) => { e.stopPropagation(); setPublicLinkDialogOpen(true); }}>
                                        <LinkOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Share">
                                    <IconButton onClick={(e) => { e.stopPropagation(); setShareDialogOpen(true); }}>
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
                    cursor: item.type === "FOLDER" ? "pointer" : "default",
                }}
            >
                <ListItemIcon>
                    {item.type === "FOLDER" ? <FolderOutlined /> : <DescriptionOutlined />}
                </ListItemIcon>

                <ListItemText primary={item.name} secondary={secondaryText} />

                {item.type === "FOLDER" ? (
                    <Tooltip title="Open folder">
                        <IconButton
                            edge="end"
                            onClick={(event) => {
                                event.stopPropagation();
                                handleOpen();
                            }}
                        >
                            <FolderOutlined />
                        </IconButton>
                    </Tooltip>
                ) : null}
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