import { DescriptionOutlined, FolderOutlined } from "@mui/icons-material";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Stack } from "@mui/material";
import type { SharedWithMeItem } from "../../types/sharing";
import { PermissionBadge } from "./PermissionBadge";
import { useLazyGetFileAccessUrlQuery } from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { Alert, Snackbar } from "@mui/material";
import { PermissionGuard } from "../storage/PermissionGuard";
import { RenameNodeButton } from "../storage/RenameNodeButton";
import { DeleteNodeButton } from "../storage/DeleteNodeButton";

type SharedItemRowProps = {
    item: SharedWithMeItem;
};

export function SharedItemRow({ item }: SharedItemRowProps) {
    const navigate = useNavigate();
    const [getFileAccessUrl, { isFetching }] = useLazyGetFileAccessUrlQuery();
    const [isOpening, setIsOpening] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleOpen = async () => {
        if (item.nodeType === "FOLDER") {
            navigate(`/drive/${item.nodeId}`);
        } else {
            if (isFetching || isOpening) return;
            setIsOpening(true);
            try {
                const response = await getFileAccessUrl(item.nodeId).unwrap();
                if (response.data?.url) {
                    window.open(response.data.url, "_blank", "noopener,noreferrer");
                } else {
                    setErrorMsg("No secure URL found for this file.");
                }
            } catch (error) {
                setErrorMsg(getApiErrorMessage(error, "Failed to fetch file access URL."));
            } finally {
                setIsOpening(false);
            }
        }
    };

    const secondaryText = `Shared by ${item.ownerId} • ${new Date(item.sharedAt).toLocaleDateString()}`;

    return (
        <>
            <ListItem
                divider
                onClick={handleOpen}
                sx={{
                    cursor: (item.nodeType === "FOLDER" || (!isFetching && !isOpening)) ? "pointer" : "wait",
                    opacity: (isFetching || isOpening) ? 0.6 : 1
                }}
                secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PermissionBadge permission={item.permission} />
                        <PermissionGuard requiredLevel="EDIT" nodeAccess={item.permission}>
                            <RenameNodeButton node={{
                                id: item.nodeId,
                                name: item.nodeName,
                                type: item.nodeType,
                                accessLevel: item.permission,
                                parentId: null,
                                ownerId: item.ownerId,
                                createdAt: new Date(item.sharedAt).toISOString(),
                                updatedAt: new Date(item.sharedAt).toISOString()
                            }} />
                            <DeleteNodeButton node={{
                                id: item.nodeId,
                                name: item.nodeName,
                                type: item.nodeType,
                                accessLevel: item.permission,
                                parentId: null,
                                ownerId: item.ownerId,
                                createdAt: new Date(item.sharedAt).toISOString(),
                                updatedAt: new Date(item.sharedAt).toISOString()
                            }} />
                        </PermissionGuard>
                    </Stack>
                }
            >
                <ListItemIcon>
                    {item.nodeType === "FOLDER" ? <FolderOutlined /> : <DescriptionOutlined />}
                </ListItemIcon>
                <ListItemText primary={item.nodeName} secondary={secondaryText} />
            </ListItem>

            <Snackbar
                open={!!errorMsg}
                autoHideDuration={6000}
                onClose={() => setErrorMsg(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={() => setErrorMsg(null)} severity="error" sx={{ width: "100%" }}>
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>
    );
}
