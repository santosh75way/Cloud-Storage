import type { ReactNode } from "react";
import type { SharePermission } from "../../types/sharing";

type PermissionGuardProps = {
    nodeAccess?: SharePermission | "OWNER";
    requiredLevel: "EDIT" | "OWNER";
    children: ReactNode;
    fallback?: ReactNode;
};

export function PermissionGuard({ nodeAccess, requiredLevel, children, fallback = null }: PermissionGuardProps) {
    const hasAccess = (() => {
        if (requiredLevel === "OWNER") {
            return nodeAccess === "OWNER";
        }
        if (requiredLevel === "EDIT") {
            return nodeAccess === "OWNER" || nodeAccess === "EDIT";
        }
        return false;
    })();

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
