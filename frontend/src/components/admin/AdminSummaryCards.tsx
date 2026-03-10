import { Box, Card, Typography, Button, IconButton, Divider } from "@mui/material";
import {
    ContentCopy as CopyIcon,
    Description as FileIcon,
    Folder as FolderIcon,
} from "@mui/icons-material";

export function AdminSummaryCards() {
    return (
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            {/* Quick Share Link Placeholder */}
            <Card sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Typography variant="h6" fontWeight="700" mb={1} fontSize="1.1rem">
                    Quick Share Link
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Copy link to share:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e2e8f0",
                        borderRadius: 1.5,
                        p: 1,
                        mb: 2,
                        bgcolor: "#f8fafc",
                    }}
                >
                    <Typography variant="body2" sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }} color="text.secondary">
                        https://cloudstorage.com/s/<b>abct323</b>
                    </Typography>
                    <IconButton size="small">
                        <CopyIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Button variant="contained" color="primary" fullWidth sx={{ borderRadius: 2, textTransform: "none" }}>
                    Copy Link
                </Button>
            </Card>

            {/* Storage Usage Placeholder */}
            <Card sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Typography variant="h6" fontWeight="700" mb={3} fontSize="1.1rem">
                    Storage Usage
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            border: "12px solid #e2e8f0",
                            borderTopColor: "#f59e0b",
                            borderRightColor: "#4a90e2",
                            borderBottomColor: "#4a90e2",
                            borderLeftColor: "#4a90e2",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="h5" fontWeight="700">82<Typography component="span" variant="caption">GB</Typography></Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>/100 GB</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="600">82% <Typography component="span" variant="body2" color="text.secondary">Used</Typography></Typography>
                </Box>
            </Card>

            {/* Recent Searches Placeholder */}
            <Card sx={{ flex: 1, minWidth: 280, p: 3, borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                <Typography variant="h6" fontWeight="700" mb={1} fontSize="1.1rem">
                    Recent Searches
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 0.5, bgcolor: "#f1f5f9", borderRadius: 1, display: "flex" }}><FileIcon fontSize="small" color="disabled" /></Box>
                        <Typography variant="body2" color="primary" fontWeight={500} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>Marketing Plan</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 0.5, bgcolor: "#f1f5f9", borderRadius: 1, display: "flex" }}><FileIcon fontSize="small" color="disabled" /></Box>
                        <Typography variant="body2" color="primary" fontWeight={500} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>Invoice 2024</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ p: 0.5, bgcolor: "#f1f5f9", borderRadius: 1, display: "flex" }}><FolderIcon fontSize="small" color="disabled" /></Box>
                        <Typography variant="body2" color="primary" fontWeight={500} sx={{ cursor: "pointer", "&:hover": { textDecoration: "underline" } }}>Photos</Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
