import { List, Paper, Typography } from "@mui/material";
import type { SearchNode } from "../../types/search";
import { SearchResultRow } from "./SearchResultRow";
import { SearchOffOutlined } from "@mui/icons-material";

type SearchResultsListProps = {
    items: SearchNode[];
    currentUserId?: string;
};

export function SearchResultsList({ items, currentUserId }: SearchResultsListProps) {
    if (items.length === 0) {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 6,
                    textAlign: "center",
                    bgcolor: "grey.50",
                    borderStyle: "dashed",
                    borderRadius: 2,
                }}
            >
                <SearchOffOutlined sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Results Found
                </Typography>
                <Typography color="text.secondary" variant="body2">
                    Try adjusting your filters or search keywords.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <List disablePadding>
                {items.map((node) => (
                    <SearchResultRow
                        key={node.id}
                        item={node}
                        isOwner={currentUserId === node.ownerId}
                    />
                ))}
            </List>
        </Paper>
    );
}
