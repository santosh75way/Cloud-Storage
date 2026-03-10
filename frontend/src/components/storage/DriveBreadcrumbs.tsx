import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { BreadcrumbItem } from "../../types/storage";

type DriveBreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function DriveBreadcrumbs({ items }: DriveBreadcrumbsProps) {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={RouterLink} underline="hover" color="inherit" to="/drive">
                Root
            </MuiLink>

            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast) {
                    return (
                        <Typography key={item.id} color="text.primary">
                            {item.name}
                        </Typography>
                    );
                }

                return (
                    <MuiLink
                        key={item.id}
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to={`/drive/${item.id}`}
                    >
                        {item.name}
                    </MuiLink>
                );
            })}
        </Breadcrumbs>
    );
}