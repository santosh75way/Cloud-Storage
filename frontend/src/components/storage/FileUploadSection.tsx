import { useRef } from "react";
import { CloudUpload } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";
import { useCloudinaryUpload } from "../../hooks/useCloudinaryUpload";

type FileUploadSectionProps = {
    parentId: string | null;
};

export function FileUploadSection({ parentId }: FileUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { uploadFile, isLoading, error } = useCloudinaryUpload({
        parentId,
        onSuccess: () => {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    });

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const success = await uploadFile(file);

        if (!success && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Box>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <Stack spacing={2} direction="row" alignItems="center">
                <Button
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                >
                    {isLoading ? "Uploading..." : "Upload File"}
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
