import { Alert, Box } from "@mui/material";

export function PublicReadOnlyBanner() {
    return (
        <Box mb={2}>
            <Alert severity="info" variant="standard">
                You are viewing a public shared item. You have read-only access.
            </Alert>
        </Box>
    );
}
