import { Card, CardContent, List, Stack, Typography } from "@mui/material";
import type { StorageNode } from "../../types/storage";
import { DriveNodeRow } from "./DriveNodeRow";

type DriveNodeListProps = {
  items: StorageNode[];
};

export function DriveNodeList({ items }: DriveNodeListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">No files or folders found.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            Items
          </Typography>

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