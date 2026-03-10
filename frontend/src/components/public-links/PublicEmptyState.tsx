import { Box, Typography } from "@mui/material";
import { FolderCopyOutlined } from "@mui/icons-material";

export function PublicEmptyState() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={8}
            sx={{ color: "text.secondary" }}
        >
            <FolderCopyOutlined sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">This folder is empty</Typography>
            <Typography variant="body2">No files or subfolders found.</Typography>
        </Box>
    );
}
