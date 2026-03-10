import { DescriptionOutlined, FolderOutlined, OpenInNewOutlined } from "@mui/icons-material";
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
import type { SearchNode } from "../../types/search";
import { useLazyGetFileAccessUrlQuery } from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { Alert, Snackbar } from "@mui/material";
import { PermissionBadge } from "../sharing/PermissionBadge";

type SearchResultRowProps = {
    item: SearchNode;
    isOwner: boolean;
};

export function SearchResultRow({ item, isOwner }: SearchResultRowProps) {
    const navigate = useNavigate();
    const [getFileAccessUrl, { isFetching }] = useLazyGetFileAccessUrlQuery();
    const [isOpening, setIsOpening] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleOpen = async () => {
        if (item.type === "FOLDER") {
            navigate(`/drive/${item.id}`);
        } else {
            if (isFetching || isOpening) return;
            setIsOpening(true);
            try {
                const response = await getFileAccessUrl(item.id).unwrap();
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

    const secondaryTextParts = [];
    if (item.type === "FILE" && item.size) {
        const kb = (item.size / 1024).toFixed(1);
        secondaryTextParts.push(`${kb} KB`);
    }
    secondaryTextParts.push(`Modified: ${new Date(item.updatedAt).toLocaleDateString()}`);

    const secondaryText = secondaryTextParts.join(" • ");

    return (
        <>
            <ListItem
                divider
                onClick={handleOpen}
                sx={{
                    cursor: (item.type === "FOLDER" || (!isFetching && !isOpening)) ? "pointer" : "wait",
                    opacity: (isFetching || isOpening) ? 0.6 : 1,
                    "&:hover": {
                        bgcolor: "action.hover",
                    }
                }}
                secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                        <PermissionBadge permission={isOwner ? "OWNER" : item.accessLevel} />

                        <Tooltip title={item.type === "FOLDER" ? "Open folder" : "Open file"}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpen();
                                }}
                            >
                                <OpenInNewOutlined fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
            >
                <ListItemIcon>
                    {item.type === "FOLDER" ? <FolderOutlined /> : <DescriptionOutlined />}
                </ListItemIcon>
                <ListItemText primary={item.name} secondary={secondaryText} />
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
