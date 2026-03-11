import { Card, CardContent, List, Stack, Typography, Box } from "@mui/material";
import { FolderOffOutlined } from "@mui/icons-material";
import type { StorageNode } from "../../types/storage";
import { DriveNodeRow } from "./DriveNodeRow";

type DriveNodeListProps = {
  items: StorageNode[];
};

export function DriveNodeList({ items }: DriveNodeListProps) {
  if (items.length === 0) {
    return (
      <Card
        elevation={0}
        sx={{
          border: "1px dashed #E2E8F0",
          animation: "fadeIn 0.3s ease-out",
        }}
      >
        <CardContent sx={{ py: 6, textAlign: "center" }}>
          <FolderOffOutlined sx={{ fontSize: 48, color: "#CBD5E1", mb: 1.5 }} />
          <Typography variant="body1" fontWeight={500} color="text.secondary">
            No files or folders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload files or create a folder to get started.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E2E8F0",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <CardContent>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight={700} fontSize="1rem">
              Items
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </Typography>
          </Box>

          <List disablePadding>
            {items.map((item) => (
              <DriveNodeRow key={item.id} item={item} />
            ))}
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}