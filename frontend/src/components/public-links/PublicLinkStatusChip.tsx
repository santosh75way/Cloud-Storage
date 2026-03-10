import { Chip } from "@mui/material";
import { CheckCircleOutline, CancelOutlined, AccessTimeOutlined } from "@mui/icons-material";
import type { PublicShareLink } from "../../types/publicLinks";

type Props = {
    link: PublicShareLink;
};

export function PublicLinkStatusChip({ link }: Props) {
    const isRevoked = !link.isActive;
    const isExpired = link.expiresAt ? new Date(link.expiresAt).getTime() < Date.now() : false;

    if (isRevoked) {
        return (
            <Chip
                icon={<CancelOutlined />}
                label="Revoked"
                color="error"
                size="small"
                variant="outlined"
            />
        );
    }

    if (isExpired) {
        return (
            <Chip
                icon={<AccessTimeOutlined />}
                label="Expired"
                color="warning"
                size="small"
                variant="outlined"
            />
        );
    }

    return (
        <Chip
            icon={<CheckCircleOutline />}
            label="Active"
            color="success"
            size="small"
            variant="outlined"
        />
    );
}
