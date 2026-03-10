import { useMemo, useState } from "react";
import { CreateNewFolder as AddFolderIcon } from "@mui/icons-material";
import {
    Alert,
    Button,
    Box,
    TextField,
    Typography,
} from "@mui/material";
import { useCreateFolderMutation } from "../../services/storageApi";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { createFolderFormSchema } from "./storageForm.schemas";

type CreateFolderSectionProps = {
    parentId: string | null;
};

export function CreateFolderSection({ parentId }: CreateFolderSectionProps) {
    const [name, setName] = useState("");
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [createFolder, { isLoading, error }] = useCreateFolderMutation();

    const apiErrorMessage = useMemo(() => {
        return error ? getApiErrorMessage(error, "Failed to create folder.") : null;
    }, [error]);

    const handleSubmit = async () => {
        const parsedResult = createFolderFormSchema.safeParse({ name });

        if (!parsedResult.success) {
            const nextFieldError = parsedResult.error.issues[0]?.message ?? "Invalid folder name";
            setFieldError(nextFieldError);
            return;
        }

        setFieldError(null);

        await createFolder({
            name: parsedResult.data.name,
            parentId,
        }).unwrap();

        setName("");
    };

    return (
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TextField
                        size="small"
                        placeholder="New folder name"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            if (fieldError) setFieldError(null);
                        }}
                        error={Boolean(fieldError)}
                        sx={{
                            minWidth: 200,
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                bgcolor: "white",
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddFolderIcon />}
                        onClick={handleSubmit}
                        disabled={isLoading || !name.trim()}
                        sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 600,
                            boxShadow: "none",
                            "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }
                        }}
                    >
                        Create Folder
                    </Button>
                </Box>
                {fieldError && <Typography color="error" variant="caption" sx={{ mt: 0.5, ml: 1 }}>{fieldError}</Typography>}
                {apiErrorMessage && <Alert severity="error" sx={{ mt: 1, py: 0, '& .MuiAlert-message': { py: 0.5 } }}>{apiErrorMessage}</Alert>}
            </Box>
        </Box>
    );
}