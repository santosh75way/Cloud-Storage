import { useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { CircularProgress, IconButton } from "@mui/material";
import { useLazyGetFileAccessUrlQuery } from "../../services/storageApi";
import type { StorageNode } from "../../types/storage";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

type OpenFileButtonProps = {
    node: StorageNode;
    onError: (message: string) => void;
};

export function OpenFileButton({ node, onError }: OpenFileButtonProps) {
    const [getFileAccessUrl, { isFetching }] = useLazyGetFileAccessUrlQuery();
    const [isOpening, setIsOpening] = useState(false);

    const handleOpenClick = async (event: React.MouseEvent) => {
        event.stopPropagation();

        if (isFetching || isOpening) {
            return;
        }

        setIsOpening(true);

        try {
            const response = await getFileAccessUrl(node.id).unwrap();

            if (response.data?.url) {
                window.open(response.data.url, "_blank", "noopener,noreferrer");
            } else {
                onError("No secure URL found for this file.");
            }
        } catch (error) {
            const message = getApiErrorMessage(error, "Failed to fetch file access URL.");
            onError(message);
        } finally {
            setIsOpening(false);
        }
    };

    return (
        <IconButton
            edge="end"
            onClick={handleOpenClick}
            disabled={isFetching || isOpening}
            title="Open File"
        >
            {isFetching || isOpening ? <CircularProgress size={24} /> : <OpenInNew />}
        </IconButton>
    );
}
