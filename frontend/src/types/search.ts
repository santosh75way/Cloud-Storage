export type SearchNodeType = "FILE" | "FOLDER";

export type SearchOwnership = "MINE" | "NOT_MINE" | "ALL";

export type SearchSharedStatus = "SHARED_WITH_ME" | "SHARED_BY_ME" | "PUBLIC_LINKED" | "ALL";

export type SearchAccessLevel = "OWNER" | "EDIT" | "VIEW";

export type SearchNode = {
    id: string;
    name: string;
    type: SearchNodeType;
    parentId: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    mimeType?: string | null;
    size?: number | null;
    extension?: string | null;
    accessLevel: SearchAccessLevel;
};

export type PaginatedSearchList = {
    items: SearchNode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type SearchQueryPayload = {
    q?: string;
    type?: SearchNodeType;
    ownership?: SearchOwnership;
    sharedStatus?: SearchSharedStatus;
    page?: number;
    limit?: number;
};
