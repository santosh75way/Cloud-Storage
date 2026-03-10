import { Chip, type ChipProps } from "@mui/material";
import { VisibilityOutlined, EditOutlined, SecurityOutlined } from "@mui/icons-material";
import type { SharePermission } from "../../types/sharing";

export type PermissionBadgeProps = {
    permission: SharePermission | "OWNER";
    size?: ChipProps["size"];
};

export function PermissionBadge({ permission, size = "small" }: PermissionBadgeProps) {
    if (permission === "OWNER") {
        return (
            <Chip
                icon={<SecurityOutlined />}
                label="Owner"
                color="secondary"
                size={size}
                variant="filled"
            />
        );
    }

    if (permission === "EDIT") {
        return (
            <Chip
                icon={<EditOutlined />}
                label="Editor"
                color="primary"
                size={size}
                variant="filled"
            />
        );
    }

    return (
        <Chip
            icon={<VisibilityOutlined />}
            label="Viewer"
            color="default"
            size={size}
            variant="outlined"
        />
    );
}
