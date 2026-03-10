import { Box, CircularProgress, Container, Typography, Paper, Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetPublicNodeByTokenQuery } from "../services/publicLinksApi";
import { PublicBreadcrumbs } from "../components/public-links/PublicBreadcrumbs";
import { PublicNodeList } from "../components/public-links/PublicNodeList";
import { PublicNodeRow } from "../components/public-links/PublicNodeRow";
import { PublicReadOnlyBanner } from "../components/public-links/PublicReadOnlyBanner";
import { PublicErrorState } from "../components/public-links/PublicErrorState";

export default function PublicSharePage() {
    const { token } = useParams<{ token: string }>();

    const { data: response, isLoading, isError, error } = useGetPublicNodeByTokenQuery(
        token || "",
        { skip: !token }
    );

    if (!token) {
        return <PublicErrorState title="Invalid Link" message="No access token provided." />;
    }

    if (isLoading) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress size={48} sx={{ mb: 4 }} />
                    <Typography variant="h6" color="text.secondary">
                        Loading shared workspace...
                    </Typography>
                </Box>
            </Container>
        );
    }

    if (isError || !response?.success) {
        // Determine specific errors like 410 Gone, 404 Not Found, 401 Unauthorized, etc.
        const errObj = error as any;
        const msg = errObj?.data?.message || errObj?.message || "This shared link is invalid or has expired.";
        return <PublicErrorState message={msg} />;
    }

    const rootNode = response.data;

    // Render file viewer directly if the public token resolves to a FILE
    if (rootNode.type === "FILE") {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <PublicReadOnlyBanner />
                <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        {rootNode.name}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <PublicNodeRow item={rootNode} isRootFile={true} />
                </Paper>
            </Container>
        );
    }

    // Render folder explorer if the public token resolves to a FOLDER
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <PublicReadOnlyBanner />

            <Box mb={4}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Shared Folder
                </Typography>
                <PublicBreadcrumbs />
            </Box>

            <PublicNodeList />
        </Container>
    );
}
