import { useState } from "react";
import { IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { ContentCopyOutlined } from "@mui/icons-material";
import type { PublicShareLink } from "../../types/publicLinks";

type Props = {
    link: PublicShareLink;
};

export function CopyPublicLinkButton({ link }: Props) {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const getFullPublicUrl = () => {
        return `${window.location.origin}/public/${link.token}`;
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(getFullPublicUrl());
            setOpenSnackbar(true);
        } catch (err) {
            console.error("Failed to copy link:", err);
        }
    };

    const isInvalid = !link.isActive || (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now());

    return (
        <>
            <Tooltip title="Copy Public Link">
                <span>
                    <IconButton onClick={handleCopy} size="small" disabled={Boolean(isInvalid)}>
                        <ContentCopyOutlined fontSize="small" />
                    </IconButton>
                </span>
            </Tooltip>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Public link copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}
