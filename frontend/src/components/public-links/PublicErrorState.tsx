import { Box, Typography, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

type Props = {
    title?: string;
    message?: string;
    onRetry?: () => void;
};

export function PublicErrorState({
    title = "This link is no longer active",
    message = "The public share link has been revoked, expired, or the item was deleted.",
    onRetry
}: Props) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="50vh"
            sx={{ textAlign: "center", p: 4 }}
        >
            <ErrorOutline color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                {message}
            </Typography>

            {onRetry && (
                <Button variant="outlined" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </Box>
    );
}
