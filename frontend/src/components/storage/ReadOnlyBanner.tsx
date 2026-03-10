import { Alert, Box } from "@mui/material";

type ReadOnlyBannerProps = {
    isReadOnly: boolean;
};

export function ReadOnlyBanner({ isReadOnly }: ReadOnlyBannerProps) {
    if (!isReadOnly) return null;

    return (
        <Box mb={2}>
            <Alert severity="info" variant="outlined">
                You have View-Only access to this folder. Some actions have been restricted.
            </Alert>
        </Box>
    );
}
