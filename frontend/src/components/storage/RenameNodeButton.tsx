import { useMemo, useState } from "react";
import { EditOutlined } from "@mui/icons-material";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import type { StorageNode } from "../../types/storage";
import { useRenameNodeMutation } from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { renameNodeFormSchema } from "./storageForm.schemas";

type RenameNodeDialogProps = {
    node: StorageNode;
    open: boolean;
    onClose: () => void;
};

export function RenameNodeDialog({ node, open, onClose }: RenameNodeDialogProps) {
    const [name, setName] = useState(node.name);
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [renameNode, { isLoading, error }] = useRenameNodeMutation();

    const apiErrorMessage = useMemo(() => {
        return error ? getApiErrorMessage(error, "Failed to rename item.") : null;
    }, [error]);

    const handleClose = () => {
        onClose();
        setName(node.name);
        setFieldError(null);
    };

    const handleSubmit = async () => {
        const parsedResult = renameNodeFormSchema.safeParse({ name });

        if (!parsedResult.success) {
            const nextFieldError = parsedResult.error.issues[0]?.message ?? "Invalid name";
            setFieldError(nextFieldError);
            return;
        }

        setFieldError(null);

        await renameNode({
            nodeId: node.id,
            body: { name: parsedResult.data.name },
        }).unwrap();

        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" onClick={(e) => e.stopPropagation()}>
            <DialogTitle>Rename {node.type.toLowerCase()}</DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ pt: 1 }}>
                    {apiErrorMessage ? <Alert severity="error">{apiErrorMessage}</Alert> : null}

                    <TextField
                        autoFocus
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            if (fieldError) {
                                setFieldError(null);
                            }
                        }}
                        error={Boolean(fieldError)}
                        helperText={fieldError ?? " "}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

type RenameNodeButtonProps = {
    node: StorageNode;
};

export function RenameNodeButton({ node }: RenameNodeButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                edge="end"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen(true);
                }}
            >
                <EditOutlined />
            </IconButton>

            <RenameNodeDialog node={node} open={open} onClose={() => setOpen(false)} />
        </>
    );
}