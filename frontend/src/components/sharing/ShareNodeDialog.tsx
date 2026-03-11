import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Alert,
    Stack,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import type { StorageNode } from "../../types/storage";
import { NodeSharesList } from "./NodeSharesList";
import { SharePermissionSelect } from "./SharePermissionSelect";
import { useCreateShareMutation } from "../../services/sharingApi";
import type { SharePermission } from "../../types/sharing";

type ShareNodeDialogProps = {
    open: boolean;
    onClose: () => void;
    node: StorageNode;
};

export function ShareNodeDialog({ open, onClose, node }: ShareNodeDialogProps) {
    const [targetUserId, setTargetUserId] = useState("");
    const [permission, setPermission] = useState<SharePermission>("VIEW");
    const [localError, setLocalError] = useState<string | null>(null);

    const [createShare, { isLoading }] = useCreateShareMutation();

    const handleClose = () => {
        setTargetUserId("");
        setPermission("VIEW");
        setLocalError(null);
        onClose();
    };

    const handleShare = async () => {
        setLocalError(null);

        if (!targetUserId.trim()) {
            setLocalError("Please enter a User ID");
            return;
        }

        try {
            await createShare({
                nodeId: node.id,
                sharedWithUserId: targetUserId.trim(),
                permission,
            }).unwrap();

            setTargetUserId("");
            setPermission("VIEW");
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : "Failed to share node";
            setLocalError(msg);
        }
    };

    const nodeLabel = node.type === "FOLDER" ? "Folder" : "File";

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Share {nodeLabel}</DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            {node.name}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <TextField
                                autoFocus
                                label="User ID"
                                placeholder="Enter exact User ID to share with"
                                fullWidth
                                size="small"
                                value={targetUserId}
                                onChange={(e) => setTargetUserId(e.target.value)}
                                disabled={isLoading}
                            />
                            <SharePermissionSelect
                                value={permission}
                                onChange={setPermission}
                                disabled={isLoading}
                            />
                            <Button
                                variant="contained"
                                onClick={handleShare}
                                disabled={isLoading || !targetUserId.trim()}
                                sx={{ height: 40 }}
                            >
                                Share
                            </Button>
                        </Stack>
                        {localError && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {localError}
                            </Alert>
                        )}
                    </Box>

                    <Divider />

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            People with access
                        </Typography>
                        <NodeSharesList node={node} />
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Done</Button>
            </DialogActions>
        </Dialog>
    );
}
