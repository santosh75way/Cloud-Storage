export type SharePermission = "VIEW" | "EDIT";

export type ShareRecord = {
    id: string;
    nodeId: string;
    sharedWithUserId: string;
    permission: SharePermission;
    createdAt: string;
    updatedAt: string;
};

export type CreateSharePayload = {
    nodeId: string;
    sharedWithUserId: string;
    permission: SharePermission;
};

export type UpdateSharePayload = {
    permission: SharePermission;
};

export type SharedWithMeItem = {
    shareId: string;
    permission: SharePermission;
    nodeId: string;
    nodeName: string;
    nodeType: "FILE" | "FOLDER";
    ownerId: string;
    sharedAt: string;
    mimeType?: string | null;
    size?: number | null;
    extension?: string | null;
};
