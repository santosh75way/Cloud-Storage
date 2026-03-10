import { Box, Chip, Stack, Typography } from "@mui/material";
import type { SearchNodeType, SearchOwnership, SearchSharedStatus } from "../../types/search";

type SearchFiltersProps = {
    type: SearchNodeType | "ALL";
    ownership: SearchOwnership;
    sharedStatus: SearchSharedStatus;
    onChangeType: (val: SearchNodeType | "ALL") => void;
    onChangeOwnership: (val: SearchOwnership) => void;
    onChangeSharedStatus: (val: SearchSharedStatus) => void;
};

export function SearchFilters({
    type,
    ownership,
    sharedStatus,
    onChangeType,
    onChangeOwnership,
    onChangeSharedStatus,
}: SearchFiltersProps) {
    return (
        <Stack spacing={3}>
            <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Type
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {(["ALL", "FILE", "FOLDER"] as const).map((t) => (
                        <Chip
                            key={t}
                            label={t === "ALL" ? "Any Type" : t}
                            onClick={() => onChangeType(t)}
                            color={type === t ? "primary" : "default"}
                            variant={type === t ? "filled" : "outlined"}
                            size="small"
                        />
                    ))}
                </Stack>
            </Box>

            <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Ownership
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[
                        { value: "ALL", label: "Anyone" },
                        { value: "MINE", label: "Owned by me" },
                        { value: "NOT_MINE", label: "Not owned by me" },
                    ].map((o) => (
                        <Chip
                            key={o.value}
                            label={o.label}
                            onClick={() => onChangeOwnership(o.value as SearchOwnership)}
                            color={ownership === o.value ? "primary" : "default"}
                            variant={ownership === o.value ? "filled" : "outlined"}
                            size="small"
                        />
                    ))}
                </Stack>
            </Box>

            <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                    Shared Status
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[
                        { value: "ALL", label: "Any Status" },
                        { value: "SHARED_WITH_ME", label: "Shared with me" },
                        { value: "SHARED_BY_ME", label: "Shared by me" },
                        { value: "PUBLIC_LINKED", label: "Publicly linked" },
                    ].map((s) => (
                        <Chip
                            key={s.value}
                            label={s.label}
                            onClick={() => onChangeSharedStatus(s.value as SearchSharedStatus)}
                            color={sharedStatus === s.value ? "primary" : "default"}
                            variant={sharedStatus === s.value ? "filled" : "outlined"}
                            size="small"
                        />
                    ))}
                </Stack>
            </Box>
        </Stack>
    );
}
