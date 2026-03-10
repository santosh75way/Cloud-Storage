import { useState } from "react";
import { Box, Card, Typography, Breadcrumbs, Link as MuiLink, CircularProgress, Alert, Pagination } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
    useGetFolderChildrenQuery,
    useGetRootChildrenQuery,
    useGetBreadcrumbsQuery,
    useDeleteNodeMutation,
} from "../../services/storageApi";
import { AdminExplorerToolbar } from "./AdminExplorerToolbar";
import { AdminExplorerTable } from "./AdminExplorerTable";
import { getApiErrorMessage } from "../../utils/getApiErrorMessage";
import { RenameNodeDialog } from "../storage/RenameNodeButton";
import { ShareNodeDialog } from "../sharing/ShareNodeDialog";
import type { StorageNode } from "../../types/storage";

type AdminExplorerSectionProps = {
    folderId?: string;
};

export function AdminExplorerSection({ folderId }: AdminExplorerSectionProps) {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    // Data fetching
    const isRoot = !folderId;
    const rootQuery = useGetRootChildrenQuery({ page, limit: 10 }, { skip: !isRoot });
    const folderQuery = useGetFolderChildrenQuery(
        { folderId: folderId!, page, limit: 10 },
        { skip: isRoot }
    );

    const breadcrumbsQuery = useGetBreadcrumbsQuery(folderId!, { skip: isRoot });
    const [deleteNode] = useDeleteNodeMutation();

    const currentQuery = isRoot ? rootQuery : folderQuery;
    const { data, isLoading, isError, error } = currentQuery;

    const items = data?.data?.items || [];
    const meta = data?.data;

    const handleNavigate = (id: string) => {
        setSelectedNodeId(null);
        setPage(1);
        navigate(`/admin/dashboard/${id}`);
    };

    const handleSelectNode = (id: string) => {
        setSelectedNodeId(id === selectedNodeId ? null : id);
    };

    const handleDelete = async () => {
        if (!selectedNodeId) return;
        if (confirm("Are you sure you want to delete this folder/file?")) {
            try {
                await deleteNode(selectedNodeId).unwrap();
                setSelectedNodeId(null);
            } catch (err: unknown) {
                alert(getApiErrorMessage(err, "Failed to delete item"));
            }
        }
    };

    return (
        <Card sx={{ p: 0, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Breadcrumb Header */}
            <Box sx={{ p: 2, borderBottom: "1px solid #f1f5f9", bgcolor: "#fff" }}>
                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext fontSize="small" />}>
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/admin/dashboard" sx={{ fontWeight: isRoot ? 600 : 400, color: isRoot ? "text.primary" : "text.secondary" }}>
                        My Drive
                    </MuiLink>
                    {!isRoot && breadcrumbsQuery.data?.data?.items && breadcrumbsQuery.data.data.items.map((b: { id: string; name: string }, idx: number) => {
                        const isLast = idx === (breadcrumbsQuery.data!.data.items.length - 1);
                        if (isLast) return <Typography key={b.id} color="text.primary" fontWeight={600}>{b.name}</Typography>;
                        return (
                            <MuiLink key={b.id} component={RouterLink} underline="hover" color="inherit" to={`/admin/dashboard/${b.id}`}>
                                {b.name}
                            </MuiLink>
                        );
                    })}
                </Breadcrumbs>
            </Box>

            {/* Toolbar */}
            <Box sx={{ px: 3, pt: 3 }}>
                <AdminExplorerToolbar
                    parentId={folderId || null}
                    selectedNodeId={selectedNodeId}
                    onDelete={handleDelete}
                    onRename={() => setIsRenameDialogOpen(true)}
                    onShare={() => setIsShareDialogOpen(true)}
                />
            </Box>

            {/* Content Area */}
            <Box sx={{ px: 3, pb: 3, flexGrow: 1 }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : isError ? (
                    <Alert severity="error">{getApiErrorMessage(error, "Failed to load files")}</Alert>
                ) : (
                    <AdminExplorerTable
                        items={items}
                        selectedNodeId={selectedNodeId}
                        onSelectNode={handleSelectNode}
                        onNavigate={handleNavigate}
                    />
                )}

                {/* Pagination Placeholder */}
                {meta && meta.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                        <Pagination
                            count={meta.totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            shape="rounded"
                            color="primary"
                            size="small"
                        />
                    </Box>
                )}
            </Box>

            {/* Rename Dialog */}
            {selectedNodeId && items.find((n: StorageNode) => n.id === selectedNodeId) && (
                <RenameNodeDialog
                    open={isRenameDialogOpen}
                    onClose={() => setIsRenameDialogOpen(false)}
                    node={items.find((n: StorageNode) => n.id === selectedNodeId)!}
                />
            )}

            {/* Share Dialog */}
            {selectedNodeId && items.find((n: StorageNode) => n.id === selectedNodeId) && (
                <ShareNodeDialog
                    open={isShareDialogOpen}
                    onClose={() => setIsShareDialogOpen(false)}
                    node={items.find((n: StorageNode) => n.id === selectedNodeId)!}
                />
            )}
        </Card>
    );
}
