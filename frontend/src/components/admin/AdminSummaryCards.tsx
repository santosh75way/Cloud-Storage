import { Box, Card, Typography, Button, IconButton, Divider } from "@mui/material";
import {
    ContentCopy as CopyIcon,
    Description as FileIcon,
    Folder as FolderIcon,
} from "@mui/icons-material";

export function AdminSummaryCards() {
    return (
        <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
            {/* Quick Share Link */}
            <Card
                sx={{
                    flex: 1,
                    minWidth: 280,
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease",
                    animation: "fadeInUp 0.5s ease-out",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    },
                }}
            >
                <Typography variant="h6" fontWeight={700} mb={1} fontSize="1.05rem">
                    Quick Share Link
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                    Copy link to share:
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1.5px solid #E2E8F0",
                        borderRadius: 2,
                        p: 1,
                        mb: 2,
                        bgcolor: "#F8FAFC",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis" }}
                        color="text.secondary"
                    >
                        https://cloudstorage.com/s/<b>abct323</b>
                    </Typography>
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                        <CopyIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                        "&:hover": {
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
                        },
                    }}
                >
                    Copy Link
                </Button>
            </Card>

            {/* Storage Usage */}
            <Card
                sx={{
                    flex: 1,
                    minWidth: 280,
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease",
                    animation: "fadeInUp 0.5s ease-out 0.1s both",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    },
                }}
            >
                <Typography variant="h6" fontWeight={700} mb={3} fontSize="1.05rem">
                    Storage Usage
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Box
                        sx={{
                            width: 100,
                            height: 100,
                            borderRadius: "50%",
                            border: "10px solid #E2E8F0",
                            borderTopColor: "#6366f1",
                            borderRightColor: "#6366f1",
                            borderBottomColor: "#6366f1",
                            borderLeftColor: "#E2E8F0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                        }}
                    >
                        <Typography variant="h5" fontWeight={700}>
                            82
                            <Typography component="span" variant="caption">
                                GB
                            </Typography>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
                            /100 GB
                        </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight={600}>
                        82%{" "}
                        <Typography component="span" variant="body2" color="text.secondary">
                            Used
                        </Typography>
                    </Typography>
                </Box>
            </Card>

            {/* Recent Searches */}
            <Card
                sx={{
                    flex: 1,
                    minWidth: 280,
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.3s ease",
                    animation: "fadeInUp 0.5s ease-out 0.2s both",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                    },
                }}
            >
                <Typography variant="h6" fontWeight={700} mb={1} fontSize="1.05rem">
                    Recent Searches
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {[
                        { icon: <FileIcon fontSize="small" />, label: "Marketing Plan" },
                        { icon: <FileIcon fontSize="small" />, label: "Invoice 2024" },
                        { icon: <FolderIcon fontSize="small" />, label: "Photos" },
                    ].map((item) => (
                        <Box
                            key={item.label}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                p: 0.75,
                                borderRadius: 1.5,
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                "&:hover": {
                                    bgcolor: "rgba(99, 102, 241, 0.04)",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 0.5,
                                    bgcolor: "#F1F5F9",
                                    borderRadius: 1.5,
                                    display: "flex",
                                    color: "#94A3B8",
                                }}
                            >
                                {item.icon}
                            </Box>
                            <Typography
                                variant="body2"
                                color="primary"
                                fontWeight={500}
                                sx={{ "&:hover": { textDecoration: "underline" } }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Card>
        </Box>
    );
}
