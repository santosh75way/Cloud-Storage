import { useParams } from "react-router-dom";
import { AdminExplorerSection } from "@/components/admin/AdminExplorerSection";
import { AdminDashboardShell } from "@/components/admin/AdminDashboardShell";

export default function AdminDashboardPage() {
    const { folderId } = useParams<{ folderId: string }>();

    return (
        <AdminDashboardShell
            explorerSection={<AdminExplorerSection folderId={folderId} />}
        />
    );
}
