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
        <Card
            sx={{
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                animation: "fadeInUp 0.4s ease-out",
            }}
        >
            {/* Breadcrumb Header */}
            <Box sx={{ px: 2, py: 1, borderBottom: "1px solid #F1F5F9", bgcolor: "#FAFBFC", flexShrink: 0 }}>
                <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext fontSize="small" />}>
                    <MuiLink component={RouterLink} underline="hover" color="inherit" to="/admin/dashboard" sx={{ fontWeight: isRoot ? 600 : 400, color: isRoot ? "text.primary" : "text.secondary", fontSize: "0.875rem" }}>
                        My Drive
                    </MuiLink>
                    {!isRoot && breadcrumbsQuery.data?.data?.items && breadcrumbsQuery.data.data.items.map((b: { id: string; name: string }, idx: number) => {
                        const isLast = idx === (breadcrumbsQuery.data!.data.items.length - 1);
                        if (isLast) return <Typography key={b.id} color="text.primary" fontWeight={600} fontSize="0.875rem">{b.name}</Typography>;
                        return (
                            <MuiLink key={b.id} component={RouterLink} underline="hover" color="inherit" to={`/admin/dashboard/${b.id}`} sx={{ fontSize: "0.875rem" }}>
                                {b.name}
                            </MuiLink>
                        );
                    })}
                </Breadcrumbs>
            </Box>

            {/* Toolbar */}
            <Box sx={{ px: 2, pt: 2, flexShrink: 0 }}>
                <AdminExplorerToolbar
                    parentId={folderId || null}
                    selectedNodeId={selectedNodeId}
                    onDelete={handleDelete}
                    onRename={() => setIsRenameDialogOpen(true)}
                    onShare={() => setIsShareDialogOpen(true)}
                />
            </Box>

            {/* Content Area — fills remaining space with internal scroll */}
            <Box sx={{ px: 2, pb: 1, pt: 1, flex: 1, minHeight: 0, overflow: "auto", display: "flex", flexDirection: "column" }}>
                {isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress sx={{ color: "#6366f1" }} />
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

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: "auto", pt: 1, flexShrink: 0 }}>
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
