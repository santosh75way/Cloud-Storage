import { Breadcrumbs, Link, Typography, Skeleton } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useGetPublicBreadcrumbsByTokenQuery } from "../../services/publicLinksApi";

export function PublicBreadcrumbs() {
    const { token } = useParams<{ token: string }>();
    const [searchParams] = useSearchParams();
    const nodeId = searchParams.get("nodeId");
    const navigate = useNavigate();

    const { data: response, isLoading, isError } = useGetPublicBreadcrumbsByTokenQuery(
        { token: token || "", nodeId: nodeId || undefined },
        { skip: !token }
    );

    if (isLoading) {
        return (
            <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
                <Skeleton width={80} />
                <Skeleton width={120} />
            </Breadcrumbs>
        );
    }

    if (isError || !response?.success) {
        return null;
    }

    const items = response.data?.items || [];

    const handleNavigate = (pathNodeId: string, index: number) => {
        if (index === items.length - 1) return; // Already on this node

        // The very first item in breadcrumbs is always the public root scope
        if (index === 0) {
            navigate(`/public/${token}`);
        } else {
            navigate(`/public/${token}?nodeId=${pathNodeId}`);
        }
    };

    return (
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast) {
                    return (
                        <Typography key={item.id} color="text.primary" fontWeight={500}>
                            {item.name}
                        </Typography>
                    );
                }

                return (
                    <Link
                        key={item.id}
                        component="button"
                        variant="body1"
                        underline="hover"
                        color="inherit"
                        onClick={() => handleNavigate(item.id, index)}
                    >
                        {item.name}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}
