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

const disabledButtonSx = {
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    fontSize: "0.8125rem",
    py: 0.75,
    px: 1.5,
    color: "#64748B",
    borderColor: "#E2E8F0",
    transition: "all 0.2s ease",
    "&.Mui-disabled": {
        opacity: 0.45,
        color: "#94A3B8",
        borderColor: "#E2E8F0",
    },
    "&:hover": {
        borderColor: "#CBD5E1",
        bgcolor: "rgba(99, 102, 241, 0.04)",
    },
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
        } catch (err: unknown) {
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
        } catch (error: unknown) {
            setIsUploading(false);
            setUploadError(getApiErrorMessage(error, "Upload failed"));
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const isUploadLoading = isSigning || isUploading || isCreatingFile;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2 }}>
            <Button
                variant="contained"
                size="small"
                startIcon={<NewFolderIcon fontSize="small" />}
                onClick={() => setIsFolderDialogOpen(true)}
                sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    fontWeight: 600,
                    fontSize: "0.8125rem",
                    py: 0.75,
                    px: 1.5,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    "&:hover": {
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
                    },
                }}
            >
                New Folder
            </Button>

            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
            <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={isUploadLoading ? <CircularProgress size={16} sx={{ color: "#6366f1" }} /> : <UploadIcon fontSize="small" />}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadLoading}
                sx={disabledButtonSx}
            >
                {isUploadLoading ? "Uploading..." : "Upload"}
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<RenameIcon fontSize="small" />}
                onClick={onRename}
                disabled={!selectedNodeId}
                sx={disabledButtonSx}
            >
                Rename
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<DeleteIcon fontSize="small" />}
                onClick={onDelete}
                disabled={!selectedNodeId}
                sx={disabledButtonSx}
            >
                Delete
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<ShareIcon fontSize="small" />}
                onClick={onShare}
                disabled={!selectedNodeId}
                sx={disabledButtonSx}
            >
                Share
            </Button>

            <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<SearchIcon fontSize="small" />}
                onClick={() => navigate("/admin/search")}
                sx={disabledButtonSx}
            >
                Search
            </Button>

            {uploadError && (
                <Alert severity="error" sx={{ width: "100%", mt: 0.5 }}>{uploadError}</Alert>
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
                    <Button
                        onClick={handleCreateFolder}
                        variant="contained"
                        disabled={isCreatingFolder}
                        sx={{
                            textTransform: "none",
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            },
                        }}
                    >
                        {isCreatingFolder ? "Creating..." : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
