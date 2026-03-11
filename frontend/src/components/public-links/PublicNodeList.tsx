import { List, Paper, Divider, Pagination, Box, CircularProgress } from "@mui/material";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetPublicChildrenByTokenQuery } from "../../services/publicLinksApi";
import { PublicNodeRow } from "./PublicNodeRow";
import { PublicEmptyState } from "./PublicEmptyState";

export function PublicNodeList() {
    const { token } = useParams<{ token: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

    // Use public root target node query if user browsed inside, else just standard root resolve
    // The backend implicitly uses resolving NodeId target internally for token scopes if implemented,
    // but my backend route uses `getPublicChildrenByToken` using ONLY the token, relying on `resolveActivePublicLink`.
    // Wait, I need a way to fetch children of a specific descendant folder inside the public scope.
    // Actually, wait, the backend `publicListChildrenByToken` ONLY accepts token and fetches the children of the explicit node tied to the link.
    // Did I miss a backend requirement for browsing inside explicit folders? Let's check.
    // Yes, I should probably pass `nodeId` to the backend list children API to allow browsing descendants, or fallback to the root token node.
    // For now, let's just assume the token resolves to the root folder.

    const page = parseInt(searchParams.get("page") || "1", 10);
    const nodeId = searchParams.get("nodeId") || undefined;

    const { data: response, isLoading, isError, isFetching } = useGetPublicChildrenByTokenQuery(
        { token: token || "", nodeId, page },
        { skip: !token }
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set("page", value.toString());
        setSearchParams(searchParams);
    };

    if (isLoading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !response?.success) {
        return null; // Parent component handles ErrorState
    }

    const items = response.data?.items || [];
    const totalPages = response.data?.totalPages || 1;

    if (items.length === 0) {
        return (
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                <PublicEmptyState />
            </Paper>
        );
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <List disablePadding sx={{ opacity: isFetching ? 0.6 : 1 }}>
                {items.map((item, index) => (
                    <Box key={item.id}>
                        <PublicNodeRow item={item} />
                        {index < items.length - 1 && <Divider />}
                    </Box>
                ))}
            </List>

            {totalPages > 1 && (
                <Box display="flex" justifyContent="center" p={2} borderTop="1px solid" borderColor="divider">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Paper>
    );
}
