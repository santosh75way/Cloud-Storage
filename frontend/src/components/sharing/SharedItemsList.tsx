import { List, Paper, Typography, Box } from "@mui/material";
import type { SharedWithMeItem } from "../../types/sharing";
import { SharedItemRow } from "./SharedItemRow";

type SharedItemsListProps = {
    items: SharedWithMeItem[];
};

export function SharedItemsList({ items }: SharedItemsListProps) {
    if (items.length === 0) {
        return (
            <Box textAlign="center" py={8} color="text.secondary">
                <Typography variant="h6" gutterBottom>
                    No shared items
                </Typography>
                <Typography variant="body2">
                    Folders and files that other users share with you will appear here.
                </Typography>
            </Box>
        );
    }

    return (
        <Paper variant="outlined">
            <List disablePadding>
                {items.map((item) => (
                    <SharedItemRow key={item.shareId} item={item} />
                ))}
            </List>
        </Paper>
    );
}
