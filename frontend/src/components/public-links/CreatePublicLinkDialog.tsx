import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Alert,
    TextField,
} from "@mui/material";
import type { StorageNode } from "../../types/storage";
import { useCreatePublicLinkMutation } from "../../services/publicLinksApi";
import { PublicLinksList } from "./PublicLinksList";

type Props = {
    open: boolean;
    onClose: () => void;
    node: StorageNode;
};

export function CreatePublicLinkDialog({ open, onClose, node }: Props) {
    const [expiryDays, setExpiryDays] = useState<number | "">("");
    const [createLink, { isLoading, error }] = useCreatePublicLinkMutation();

    const handleCreate = async () => {
        let expiresAt: string | null = null;
        if (typeof expiryDays === "number" && expiryDays > 0) {
            const date = new Date();
            date.setDate(date.getDate() + expiryDays);
            expiresAt = date.toISOString();
        }

        try {
            await createLink({
                nodeId: node.id,
                expiresAt,
            }).unwrap();

            setExpiryDays("");
        } catch (err) {
            console.error("Failed to create public link", err);
        }
    };

    return (
        <Dialog open={open} onClose={isLoading ? undefined : onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Manage Public Links</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle2" gutterBottom>
                    Share "{node.name}" directly via a public URL
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Anyone with this link will have view-only access.
                </Typography>

                {error ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Failed to generate link.
                    </Alert>
                ) : null}

                <Box display="flex" gap={2} alignItems="flex-start" mb={3}>
                    <TextField
                        label="Expires in (days)"
                        type="number"
                        size="small"
                        value={expiryDays}
                        onChange={(e) => setExpiryDays(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Never"
                        InputProps={{ inputProps: { min: 1 } }}
                        sx={{ width: 150 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={isLoading}
                        sx={{ height: 40 }}
                    >
                        Create Link
                    </Button>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                    Active & Revoked Links
                </Typography>

                <Box sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}>
                    <PublicLinksList nodeId={node.id} />
                </Box>

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
