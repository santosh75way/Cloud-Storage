export interface PublicShareLink {
    id: string;
    nodeId: string;
    token: string;
    createdByUserId: string;
    isActive: boolean;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePublicLinkPayload {
    nodeId: string;
    expiresAt?: string | null;
}

export interface PublicNodeResponse {
    id: string;
    name: string;
    type: "FILE" | "FOLDER";
    mimeType: string | null;
    size: number | null;
    extension: string | null;
    createdAt: string;
    updatedAt: string;
    parentId: string | null;
}

export interface PublicChildrenResponse {
    items: PublicNodeResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PublicBreadcrumbsResponse {
    items: Array<{
        id: string;
        name: string;
        type: "FILE" | "FOLDER";
    }>;
}

export interface PublicFileAccessUrlResponse {
    url: string;
}
