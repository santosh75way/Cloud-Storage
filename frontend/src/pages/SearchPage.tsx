import { useState, useMemo } from "react";
import {
    Box,
    CircularProgress,
    Alert,
    Stack,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { SearchBar } from "../components/search/SearchBar";
import { SearchFilters } from "../components/search/SearchFilters";
import { SearchResultsList } from "../components/search/SearchResultsList";
import { DrivePagination } from "../components/storage/DrivePagination";
import { useSearchNodesQuery } from "../services/searchApi";
import type { SearchNodeType, SearchOwnership, SearchSharedStatus, SearchQueryPayload } from "../types/search";
import { useDebounceValue } from "../hooks/useDebounceValue";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { DriveContentHeader } from "../components/storage/DriveContentHeader";
import { DriveExplorerLayout } from "../components/storage/DriveExplorerLayout";

export function SearchPage() {
    const user = useSelector((state: RootState) => state.auth.user);

    // Search state
    const [q, setQ] = useState("");
    const debouncedQ = useDebounceValue(q, 300);

    const [type, setType] = useState<SearchNodeType | "ALL">("ALL");
    const [ownership, setOwnership] = useState<SearchOwnership>("ALL");
    const [sharedStatus, setSharedStatus] = useState<SearchSharedStatus>("ALL");
    const [page, setPage] = useState(1);
    const limit = 20;

    // Reset page on filter change
    const handleFilterChange = () => setPage(1);

    const handleQChange = (val: string) => {
        setQ(val);
        handleFilterChange();
    };
    const handleTypeChange = (val: SearchNodeType | "ALL") => {
        setType(val);
        handleFilterChange();
    };
    const handleOwnershipChange = (val: SearchOwnership) => {
        setOwnership(val);
        handleFilterChange();
    };
    const handleSharedStatusChange = (val: SearchSharedStatus) => {
        setSharedStatus(val);
        handleFilterChange();
    };

    const queryParams: SearchQueryPayload = {
        page,
        limit,
        ...(debouncedQ.trim() ? { q: debouncedQ.trim() } : {}),
        ...(type !== "ALL" ? { type } : {}),
        ownership,
        sharedStatus
    };

    const { data: searchData, isLoading, error } = useSearchNodesQuery(queryParams);

    const errorMessage = useMemo(() => {
        if (error) {
            return getApiErrorMessage(error, "Failed to load search results.");
        }
        return null;
    }, [error]);

    const items = searchData?.data.items ?? [];
    const total = searchData?.data.total ?? 0;
    const totalPages = searchData?.data.totalPages ?? 1;

    const content = (
        <Stack spacing={2} sx={{ height: "100%", flex: 1, minHeight: 0, overflow: "hidden" }}>
            {/* Header — pinned */}
            <Box sx={{ flexShrink: 0 }}>
                <DriveContentHeader
                    title="Search"
                    breadcrumbs={<Typography color="text.primary" fontSize="0.875rem">Advanced Search</Typography>}
                    actions={<Box sx={{ width: 280 }}><SearchBar value={q} onChange={handleQChange} /></Box>}
                />
            </Box>

            {/* Main content — filters + results side by side, fills remaining space */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                <Box sx={{ width: { xs: "100%", md: 240 }, flexShrink: 0 }}>
                    <SearchFilters
                        type={type}
                        ownership={ownership}
                        sharedStatus={sharedStatus}
                        onChangeType={handleTypeChange}
                        onChangeOwnership={handleOwnershipChange}
                        onChangeSharedStatus={handleSharedStatusChange}
                    />
                </Box>
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                    {errorMessage ? <Alert severity="error" sx={{ mb: 1, flexShrink: 0 }}>{errorMessage}</Alert> : null}

                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" flex={1}>
                            <CircularProgress sx={{ color: "#6366f1" }} />
                        </Box>
                    ) : (
                        <>
                            <Box sx={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                                <SearchResultsList items={items} currentUserId={user?.id} />
                            </Box>
                            <Box sx={{ flexShrink: 0, mt: 1 }}>
                                <DrivePagination
                                    page={page}
                                    totalPages={totalPages}
                                    total={total}
                                    onChange={setPage}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Stack>
        </Stack>
    );

    return <DriveExplorerLayout content={content} />;
}
