import { Stack, Box } from "@mui/material";
import { CreateFolderSection } from "./CreateFolderSection";
import { UploadFileButton } from "./UploadFileButton";
import { useGetNodeByIdQuery } from "../../services/storageApi";
import { PermissionGuard } from "./PermissionGuard";

type DriveToolbarProps = {
    parentId: string | null;
};

export function DriveToolbar({ parentId }: DriveToolbarProps) {
    // If we're at root, owner implicitly has full EDIT access.
    // Otherwise, use the fetched node access level.
    const { data } = useGetNodeByIdQuery(parentId ?? "", { skip: !parentId });
    const nodeAccess = parentId ? data?.data?.accessLevel : "OWNER";

    return (
        <PermissionGuard requiredLevel="EDIT" nodeAccess={nodeAccess}>
            <Stack
                direction={{ xs: "column", lg: "row" }}
                spacing={3}
                alignItems={{ xs: "stretch", lg: "center" }}
                sx={{
                    bgcolor: "white",
                    py: 1.5,
                    px: 2.5,
                    borderRadius: 2.5,
                    border: "1px solid #E2E8F0",
                    transition: "all 0.2s ease",
                }}
            >
                <CreateFolderSection parentId={parentId} />

                <Box sx={{ display: { xs: "none", lg: "block" }, height: 24, width: "1px", bgcolor: "#E2E8F0" }} />

                <UploadFileButton parentId={parentId} />
            </Stack>
        </PermissionGuard>
    );
}