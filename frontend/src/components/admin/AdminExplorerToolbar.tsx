import { useState, useRef } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    CircularProgress,
} from "@mui/material";
import {
    CreateNewFolder as NewFolderIcon,
    CloudUpload as UploadIcon,
    DriveFileMove as MoveIcon,
    DriveFileRenameOutline as RenameIcon,
    DeleteOutline as DeleteIcon,
    Share as ShareIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
    useCreateFolderMutation,
    useGenerateUploadSignatureMutation,
    useCreateFileNodeMutation,
} from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { z } from "zod";

const createFolderSchema = z.object({
    name: z.string().min(1, "Folder name is required").max(60, "Folder name is too long"),
});

type AdminExplorerToolbarProps = {
    parentId: string | null;
    selectedNodeId?: string | null;
    onRename?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
};

export function AdminExplorerToolbar({
    parentId,
    selectedNodeId,
    onRename,
    onDelete,
    onShare,
}: AdminExplorerToolbarProps) {
    const navigate = useNavigate();
    const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
    const [folderName, setFolderName] = useState("");
    const [folderError, setFolderError] = useState<string | null>(null);

    const [createFolder, { isLoading: isCreatingFolder, error: createFolderError }] = useCreateFolderMutation();
    const [generateSignature, { isLoading: isSigning }] = useGenerateUploadSignatureMutation();
    const [createFileNode, { isLoading: isCreatingFile }] = useCreateFileNodeMutation();

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCreateFolder = async () => {
        const parsed = createFolderSchema.safeParse({ name: folderName });
        if (!parsed.success) {
            setFolderError(parsed.error.issues[0]?.message || "Invalid name");
            return;
        }
        setFolderError(null);
        try {
            await createFolder({ name: parsed.data.name, parentId }).unwrap();
            setIsFolderDialogOpen(false);
            setFolderName("");
        } catch (err: any) {
            setFolderError(getApiErrorMessage(err, "Failed to create folder."));
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploadError(null);
        try {
            const signRes = await generateSignature({
                fileName: file.name,
                folderId: parentId,
                mimeType: file.type || "application/octet-stream",
            }).unwrap();

            const { signature, timestamp, apiKey, cloudName, folder } = signRes.data;

            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("api_key", apiKey);
            formData.append("timestamp", String(timestamp));
            formData.append("signature", signature);
            formData.append("folder", folder);

            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
            const uploadResponse = await fetch(cloudinaryUrl, { method: "POST", body: formData });
            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error?.message || "Upload failed");
            }
            setIsUploading(false);

            const extension = file.name.includes(".") ? file.name.split(".").pop() || null : null;
            await createFileNode({
                name: file.name,
                parentId,
                mimeType: file.type || "application/octet-stream",
                size: file.size,
                extension,
                cloudinaryPublicId: uploadData.public_id,
                cloudinaryResourceType: uploadData.resource_type,
            }).unwrap();
        } catch (error: any) {
            setIsUploading(false);
            setUploadError(error.message || "Upload failed");
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const isUploadLoading = isSigning || isUploading || isCreatingFile;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <Button
                variant="contained"
                startIcon={<NewFolderIcon />}
                onClick={() => setIsFolderDialogOpen(true)}
                sx={{ borderRadius: 2, textTransform: "none", boxShadow: "none" }}
            >
                New Folder
            </Button>

            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            <Button
                variant="outlined"
                color="inherit"
                startIcon={isUploadLoading ? <CircularProgress size={20} /> : <UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadLoading}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                {isUploadLoading ? "Uploading..." : "Upload"}
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                startIcon={<MoveIcon />}
                disabled={!selectedNodeId}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                Move
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                startIcon={<RenameIcon />}
                onClick={onRename}
                disabled={!selectedNodeId}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                Rename
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                disabled={!selectedNodeId}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                Delete
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                startIcon={<ShareIcon />}
                onClick={onShare}
                disabled={!selectedNodeId}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                Share
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                startIcon={<SearchIcon />}
                onClick={() => navigate('/search')}
                sx={{ borderRadius: 2, textTransform: "none", color: "text.secondary", borderColor: "#e2e8f0" }}
            >
                Search
            </Button>

            {uploadError && (
                <Alert severity="error" sx={{ width: "100%", mt: 1 }}>{uploadError}</Alert>
            )}

            {/* New Folder Dialog */}
            <Dialog open={isFolderDialogOpen} onClose={() => setIsFolderDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogContent>
                    {createFolderError ? (
                        <Alert severity="error" sx={{ mb: 2 }}>{String(getApiErrorMessage(createFolderError, "Error"))}</Alert>
                    ) : null}
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Folder Name"
                        value={folderName}
                        onChange={(e) => {
                            setFolderName(e.target.value);
                            setFolderError(null);
                        }}
                        error={!!folderError}
                        helperText={folderError}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsFolderDialogOpen(false)} color="inherit" sx={{ textTransform: "none" }}>Cancel</Button>
                    <Button onClick={handleCreateFolder} variant="contained" disabled={isCreatingFolder} sx={{ textTransform: "none", borderRadius: 2 }}>
                        {isCreatingFolder ? "Creating..." : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
