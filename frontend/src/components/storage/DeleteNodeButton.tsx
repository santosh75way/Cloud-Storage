import { useMemo, useState } from "react";
import { DeleteOutline } from "@mui/icons-material";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import type { StorageNode } from "../../types/storage";
import { useDeleteNodeMutation } from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";

type DeleteNodeButtonProps = {
    node: StorageNode;
};

export function DeleteNodeButton({ node }: DeleteNodeButtonProps) {
    const [open, setOpen] = useState(false);
    const [deleteNode, { isLoading, error }] = useDeleteNodeMutation();

    const apiErrorMessage = useMemo(() => {
        return error ? getApiErrorMessage(error, "Failed to delete item.") : null;
    }, [error]);

    const handleDelete = async () => {
        await deleteNode(node.id).unwrap();
        setOpen(false);
    };

    return (
        <>
            <IconButton
                edge="end"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen(true);
                }}
            >
                <DeleteOutline />
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" onClick={(e) => e.stopPropagation()}>
                <DialogTitle>Delete {node.type.toLowerCase()}</DialogTitle>

                <DialogContent>
                    <Stack spacing={2} sx={{ pt: 1 }}>
                        {apiErrorMessage ? <Alert severity="error">{apiErrorMessage}</Alert> : null}

                        <Typography>
                            Are you sure you want to delete <strong>{node.name}</strong>?
                        </Typography>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete} disabled={isLoading}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}