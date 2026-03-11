import { useState, useMemo } from "react";
import {
    useGenerateUploadSignatureMutation,
    useCreateFileNodeMutation,
} from "../services/storageApi";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { getCloudinaryResourceType } from "../utils/storage/getCloudinaryResourceType";
import { getFileExtension } from "../utils/storage/getFileExtension";
import { uploadFileToCloudinary } from "../utils/storage/uploadFileToCloudinary";

type UseCloudinaryUploadProps = {
    parentId: string | null;
    onSuccess?: () => void;
};

export function useCloudinaryUpload({ parentId, onSuccess }: UseCloudinaryUploadProps) {
    const [localError, setLocalError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [generateSignature, { isLoading: isSigning, error: signError }] =
        useGenerateUploadSignatureMutation();
    const [createFileNode, { isLoading: isCreatingFile, error: createError }] =
        useCreateFileNodeMutation();

    const apiErrorMessage = useMemo(() => {
        if (localError) return localError;
        if (signError) return getApiErrorMessage(signError, "Failed to prepare upload.");
        if (createError) return getApiErrorMessage(createError, "Failed to save file metadata.");
        return null;
    }, [localError, signError, createError]);

    const isLoading = isSigning || isUploading || isCreatingFile;

    const resetError = () => setLocalError(null);

    const uploadFile = async (file: File) => {
        setLocalError(null);

        // 1. Client-side Validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setLocalError("File exceeds the maximum upload size of 10MB.");
            return false;
        }

        setIsUploading(true);

        try {
            // 2. Generate backend signature
            const signatureResponse = await generateSignature({
                fileName: file.name,
                folderId: parentId,
                mimeType: file.type || "application/octet-stream",
            }).unwrap();

            // 3. Upload raw file payload directly to Cloudinary
            const cloudinaryResponse = await uploadFileToCloudinary({
                file,
                signatureData: signatureResponse.data
            });

            // 4. Save file metadata node in our backend database
            await createFileNode({
                name: file.name,
                parentId,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                extension: getFileExtension(file.name),
                cloudinaryPublicId: cloudinaryResponse.public_id,
                cloudinaryResourceType: getCloudinaryResourceType(file),
            }).unwrap();

            if (onSuccess) onSuccess();
            return true;
        } catch (error: unknown) {
            const rawError = getApiErrorMessage(error, "File upload failed.");
            const friendlyError = rawError.includes("Invalid Signature")
                ? "Upload rejected by the server due to a security signature mismatch. Please try again."
                : rawError;

            setLocalError(friendlyError);
            return false;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        uploadFile,
        isLoading,
        error: apiErrorMessage,
        resetError,
    };
}
