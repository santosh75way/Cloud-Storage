import { useState } from "react";
import {
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
    Tooltip,
    Alert,
    Stack,
    CircularProgress,
} from "@mui/material";
import { FolderOutlined, DescriptionOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import type { PublicNodeResponse } from "../../types/publicLinks";
import { useLazyGetPublicDescendantFileAccessUrlQuery, useLazyGetPublicFileAccessUrlByTokenQuery } from "../../services/publicLinksApi";

type Props = {
    item: PublicNodeResponse;
    isRootFile?: boolean;
};

export function PublicNodeRow({ item, isRootFile = false }: Props) {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [localError, setLocalError] = useState<string | null>(null);

    const [getDescendantUrl, { isFetching: isFetchingDescendant }] = useLazyGetPublicDescendantFileAccessUrlQuery();
    const [getRootUrl, { isFetching: isFetchingRoot }] = useLazyGetPublicFileAccessUrlByTokenQuery();

    const isFetching = isFetchingDescendant || isFetchingRoot;

    const handleOpenFolder = () => {
        if (item.type === "FOLDER" && token) {
            navigate(`/public/${token}?nodeId=${item.id}`);
        }
    };

    const handleOpenFile = async (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (item.type !== "FILE" || !token) return;

        try {
            setLocalError(null);

            let res;
            if (isRootFile) {
                res = await getRootUrl(token).unwrap();
            } else {
                res = await getDescendantUrl({ token, nodeId: item.id }).unwrap();
            }

            if (res.data?.url) {
                window.open(res.data.url, "_blank", "noopener,noreferrer");
            } else {
                throw new Error("Unable to fetch file URL");
            }
        } catch (err: any) {
            console.error("Failed to open file", err);
            setLocalError(err.data?.message || err.message || "Failed to open file");
        }
    };

    const handleClick = () => {
        if (item.type === "FOLDER") {
            handleOpenFolder();
        } else {
            handleOpenFile();
        }
    };

    return (
        <>
            {localError && (
                <Alert severity="error" onClose={() => setLocalError(null)} sx={{ mb: 1 }}>
                    {localError}
                </Alert>
            )}
            <ListItem
                divider
                onClick={handleClick}
                sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                }}
                secondaryAction={
                    <Stack direction="row" spacing={1}>
                        {item.type === "FILE" && (
                            <Tooltip title="Download / Open">
                                <span>
                                    <IconButton
                                        edge="end"
                                        onClick={handleOpenFile}
                                        disabled={isFetching}
                                    >
                                        {isFetching ? <CircularProgress size={24} /> : <FileDownloadOutlined />}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}

                        {item.type === "FOLDER" && (
                            <Tooltip title="Open folder">
                                <IconButton edge="end" onClick={(e) => { e.stopPropagation(); handleOpenFolder(); }}>
                                    <FolderOutlined />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                }
            >
                <ListItemIcon>
                    {item.type === "FOLDER" ? <FolderOutlined /> : <DescriptionOutlined />}
                </ListItemIcon>

                <ListItemText
                    primary={item.name}
                    secondary={item.type === "FOLDER" ? "Folder" : "File"}
                />
            </ListItem>
        </>
    );
}
