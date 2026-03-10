import { Alert, Box, CircularProgress, Container, Typography } from "@mui/material";
import { useGetSharedWithMeQuery } from "../services/sharingApi";
import { SharedItemsList } from "../components/sharing/SharedItemsList";

export default function SharedWithMePage() {
    const { data, isLoading, error } = useGetSharedWithMeQuery();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                Shared with me
            </Typography>

            {isLoading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to load shared items.
                </Alert>
            ) : (
                <Box sx={{ mt: 4 }}>
                    <SharedItemsList items={data?.data ?? []} />
                </Box>
            )}
        </Container>
    );
}
