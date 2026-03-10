import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Checkbox,
    Switch,
} from "@mui/material";
import {
    Folder as FolderIcon,
    Description as FileIcon,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
} from "@mui/icons-material";
import type { StorageNode } from "../../types/storage";

type AdminExplorerTableProps = {
    items: StorageNode[];
    selectedNodeId: string | null;
    onSelectNode: (id: string, isFolder: boolean) => void;
    onNavigate: (id: string) => void;
};

const getFileIcon = (mimeType?: string) => {
    if (!mimeType) return <FileIcon sx={{ color: "#94a3b8" }} />;
    if (mimeType.includes("image")) return <ImageIcon sx={{ color: "#3b82f6" }} />;
    if (mimeType.includes("pdf")) return <PdfIcon sx={{ color: "#ef4444" }} />;
    return <FileIcon sx={{ color: "#f59e0b" }} />;
};

export function AdminExplorerTable({
    items,
    selectedNodeId,
    onSelectNode,
    onNavigate,
}: AdminExplorerTableProps) {
    if (items.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: "center", bgcolor: "white", borderRadius: 2 }}>
                <Typography color="text.secondary">This folder is empty.</Typography>
            </Box>
        );
    }

    return (
        <TableContainer sx={{ bgcolor: "white", borderRadius: 2, border: "1px solid #f1f5f9" }}>
            <Table aria-label="explorer table" size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                        <TableCell padding="checkbox">
                            <Checkbox color="primary" size="small" />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Owner</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Last Modified</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Access</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row) => {
                        const isSelected = selectedNodeId === row.id;
                        const isFolder = row.type === "FOLDER";
                        return (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => onSelectNode(row.id, isFolder)}
                                sx={{
                                    cursor: "pointer",
                                    bgcolor: isSelected ? "#f1f5f9" : "inherit",
                                    "&:last-child td, &:last-child th": { border: 0 },
                                }}
                            >
                                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                        color="primary"
                                        size="small"
                                        checked={isSelected}
                                        onChange={() => onSelectNode(row.id, isFolder)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            typography: "body2",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {isFolder ? <FolderIcon sx={{ color: "#f59e0b" }} /> : getFileIcon(row.mimeType || undefined)}
                                        <Typography
                                            variant="body2"
                                            onClick={(e) => {
                                                if (isFolder) {
                                                    e.stopPropagation();
                                                    onNavigate(row.id);
                                                }
                                            }}
                                            sx={{
                                                fontWeight: 600,
                                                cursor: isFolder ? "pointer" : "default",
                                                "&:hover": isFolder ? { color: "primary.main", textDecoration: "underline" } : {},
                                            }}
                                        >
                                            {row.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {isFolder ? "Folder" : row.extension ? row.extension.toUpperCase() : "File"}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                        {"Me"} {/* Placeholder for owner */}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(row.updatedAt).toLocaleDateString()}
                                    </Typography>
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()}>
                                    <Switch size="small" color="success" defaultChecked />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
