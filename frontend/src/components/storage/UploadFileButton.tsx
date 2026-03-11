import { useMemo, useRef, useState } from "react";
import { UploadFile } from "@mui/icons-material";
import {
    Alert,
    Button,
    CircularProgress,
    Box,
} from "@mui/material";
import {
    useCreateFileNodeMutation,
    useGenerateUploadSignatureMutation,
} from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { getCloudinaryResourceType } from "../../utils/storage/getCloudinaryResourceType";
import { getFileExtension } from "../../utils/storage/getFileExtension";
import { uploadFileToCloudinary } from "../../utils/storage/uploadFileToCloudinary";

type UploadFileButtonProps = {
    parentId: string | null;
};

export function UploadFileButton({ parentId }: UploadFileButtonProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [generateUploadSignature, generateUploadSignatureState] =
        useGenerateUploadSignatureMutation();

    const [createFileNode, createFileNodeState] = useCreateFileNodeMutation();

    const apiErrorMessage = useMemo(() => {
        if (localError) return localError;
        if (generateUploadSignatureState.error) return getApiErrorMessage(generateUploadSignatureState.error, "Failed to prepare upload.");
        if (createFileNodeState.error) return getApiErrorMessage(createFileNodeState.error, "Failed to save file metadata.");
        return null;
    }, [localError, generateUploadSignatureState.error, createFileNodeState.error]);

    const resetFileInput = () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSelectClick = () => {
        setLocalError(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLocalError(null);

        if (file.size > 10 * 1024 * 1024) { // 10MB
            setLocalError("File exceeds the maximum upload size of 10MB.");
            resetFileInput();
            return;
        }

        setIsUploading(true);

        try {
            const signatureResponse = await generateUploadSignature({
                fileName: file.name,
                folderId: parentId,
                mimeType: file.type || "application/octet-stream",
            }).unwrap();

            const signatureData = signatureResponse.data;

            const cloudinaryResponse = await uploadFileToCloudinary({ file, signatureData });

            await createFileNode({
                name: file.name,
                parentId,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                extension: getFileExtension(file.name),
                cloudinaryPublicId: cloudinaryResponse.public_id,
                cloudinaryResourceType: getCloudinaryResourceType(file),
            }).unwrap();

            resetFileInput();
        } catch (error) {
            const rawError = getApiErrorMessage(error, "File upload failed.");
            const friendlyError = rawError.includes("Invalid Signature")
                ? "Upload rejected by the server due to a security signature mismatch. Please try again."
                : rawError;

            setLocalError(friendlyError);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {apiErrorMessage && <Alert severity="error" sx={{ py: 0, px: 1, '& .MuiAlert-message': { py: 0.5 } }}>{apiErrorMessage}</Alert>}

            <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChange}
            />

            <Button
                variant="contained"
                color="secondary"
                startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <UploadFile />}
                onClick={handleSelectClick}
                disabled={isUploading}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
                }}
            >
                {isUploading ? "Uploading..." : "Upload File"}
            </Button>
        </Box>
    );
}