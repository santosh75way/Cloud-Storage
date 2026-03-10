import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, CircularProgress, Stack } from "@mui/material";
import {
    useGetBreadcrumbsQuery,
    useGetFolderChildrenQuery,
    useGetRootChildrenQuery,
} from "../services/storageApi";
import { DriveBreadcrumbs } from "../components/storage/DriveBreadcrumbs";
import { DriveContentHeader } from "../components/storage/DriveContentHeader";
import { DriveExplorerLayout } from "../components/storage/DriveExplorerLayout";
import { DriveNodeList } from "../components/storage/DriveNodeList";
import { DrivePagination } from "../components/storage/DrivePagination";
import { DriveToolbar } from "../components/storage/DriveToolbar";
import { ReadOnlyBanner } from "../components/storage/ReadOnlyBanner";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { useGetNodeByIdQuery } from "../services/storageApi";

export function DrivePage() {
    const params = useParams<{ folderId?: string }>();
    const folderId = params.folderId ?? null;

    const { data: nodeData } = useGetNodeByIdQuery(folderId ?? "", { skip: !folderId });
    const isReadOnly = folderId ? nodeData?.data?.accessLevel === "VIEW" : false;

    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        setPage(1);
    }, [folderId]);

    const isRoot = folderId === null;

    const rootQuery = useGetRootChildrenQuery({ page, limit }, { skip: !isRoot });

    const folderQuery = useGetFolderChildrenQuery(
        { folderId: folderId ?? "", page, limit },
        { skip: isRoot }
    );

    const breadcrumbsQuery = useGetBreadcrumbsQuery(folderId ?? "", {
        skip: isRoot,
    });

    const activeListQuery = isRoot ? rootQuery : folderQuery;

    const items = useMemo(() => {
        return activeListQuery.data?.data.items ?? [];
    }, [activeListQuery.data]);

    const total = activeListQuery.data?.data.total ?? 0;
    const totalPages = activeListQuery.data?.data.totalPages ?? 1;

    const breadcrumbs = useMemo(() => {
        if (isRoot) {
            return [];
        }

        return breadcrumbsQuery.data?.data.items ?? [];
    }, [breadcrumbsQuery.data, isRoot]);

    const isLoading = activeListQuery.isLoading || (!isRoot && breadcrumbsQuery.isLoading);

    const errorMessage = useMemo(() => {
        if (activeListQuery.error) {
            return getApiErrorMessage(activeListQuery.error, "Failed to load drive data.");
        }

        if (!isRoot && breadcrumbsQuery.error) {
            return getApiErrorMessage(breadcrumbsQuery.error, "Failed to load breadcrumbs.");
        }

        return null;
    }, [activeListQuery.error, breadcrumbsQuery.error, isRoot]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <DriveExplorerLayout
            content={
                <Stack spacing={4}>
                    <DriveContentHeader
                        title="Cloud Storage"
                        breadcrumbs={<DriveBreadcrumbs items={breadcrumbs} />}
                        actions={<DriveToolbar parentId={folderId} />}
                    />

                    <ReadOnlyBanner isReadOnly={isReadOnly} />

                    {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

                    <DriveNodeList items={items} />

                    <DrivePagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        onChange={setPage}
                    />
                </Stack>
            }
        />
    );
}