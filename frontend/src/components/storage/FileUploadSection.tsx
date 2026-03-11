import { useRef, useState, useMemo } from "react";
import { CloudUpload } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
} from "@mui/material";
import {
    useCreateFileNodeMutation,
    useGenerateUploadSignatureMutation,
} from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

type FileUploadSectionProps = {
    parentId: string | null;
};

export function FileUploadSection({ parentId }: FileUploadSectionProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [generateSignature, { isLoading: isSigning, error: signError }] =
        useGenerateUploadSignatureMutation();
    const [createFileNode, { isLoading: isCreating, error: createError }] =
        useCreateFileNodeMutation();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const apiErrorMessage = useMemo(() => {
        if (uploadError) return uploadError;
        if (signError) return getApiErrorMessage(signError, "Failed to prepare upload.");
        if (createError) return getApiErrorMessage(createError, "Failed to save file info.");
        return null;
    }, [uploadError, signError, createError]);

    const isLoading = isSigning || isUploading || isCreating;

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) { // 10MB
            setUploadError("File exceeds the maximum upload size of 10MB.");
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setUploadError(null);

        try {
            // 1. Get Signature
            const signRes = await generateSignature({
                fileName: file.name,
                folderId: parentId,
                mimeType: file.type || "application/octet-stream",
            }).unwrap();

            const { signature, timestamp, apiKey, cloudName, folder, uploadPreset } = signRes.data;

            // 2. Upload to Cloudinary
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", String(timestamp));
            formData.append("signature", signature);
            formData.append("folder", folder);
            formData.append("upload_preset", uploadPreset);

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

            const uploadResponse = await fetch(cloudinaryUrl, {
                method: "POST",
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error?.message || "Upload to Cloudinary failed");
            }
            setIsUploading(false);

            // 3. Create File Node in Database
            const extension = file.name.includes(".")
                ? file.name.split(".").pop() || null
                : null;

            await createFileNode({
                name: file.name,
                parentId,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                extension,
                cloudinaryPublicId: uploadData.public_id,
                cloudinaryResourceType: uploadData.resource_type,
            }).unwrap();
        } catch (error: unknown) {
            setIsUploading(false);

            // Map noisy Cloudinary signature errors to a friendly message
            const rawError = getApiErrorMessage(error, "An unexpected error occurred during upload.");
            const friendlyError = rawError.includes("Invalid Signature")
                ? "Upload rejected by the server due to a security signature mismatch. Please try again."
                : rawError;

            setUploadError(friendlyError);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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

            {apiErrorMessage && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {apiErrorMessage}
                </Alert>
            )}
        </Box>
    );
}
