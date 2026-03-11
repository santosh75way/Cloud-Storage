import { useRef } from "react";
import { UploadFile } from "@mui/icons-material";
import {
    Alert,
    Button,
    CircularProgress,
    Box,
} from "@mui/material";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

type UploadFileButtonProps = {
    parentId: string | null;
};

export function UploadFileButton({ parentId }: UploadFileButtonProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const resetFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const { uploadFile, isLoading, error, resetError } = useCloudinaryUpload({
        parentId,
        onSuccess: resetFileInput
    });

    const handleSelectClick = () => {
        resetError();
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const success = await uploadFile(file);

        if (!success) {
            resetFileInput();
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {error && <Alert severity="error" sx={{ py: 0, px: 1, '& .MuiAlert-message': { py: 0.5 } }}>{error}</Alert>}

            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
            />

            <Button
                variant="contained"
                color="secondary"
                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <UploadFile />}
                onClick={handleSelectClick}
                disabled={isLoading}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
                }}
            >
                {isLoading ? "Uploading..." : "Upload File"}
            </Button>
        </Box>
    );
}