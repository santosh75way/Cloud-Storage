export type NodeType = "FILE" | "FOLDER";

export type StorageNode = {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;
    ownerId: string;
    createdAt: string;
    updatedAt: string;
    mimeType?: string | null;
    size?: number | null;
    extension?: string | null;
    accessLevel?: "OWNER" | "EDIT" | "VIEW"; // Resolves from backend nearest-ancestor mapping
};

export type PaginatedNodeList = {
    items: StorageNode[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type BreadcrumbItem = {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;
};

export type NodeBreadcrumbs = {
    items: BreadcrumbItem[];
};

export type CreateFolderPayload = {
    name: string;
    parentId: string | null;
};

export type RenameNodePayload = {
    name: string;
};

export type GenerateUploadSignaturePayload = {
    fileName: string;
    folderId: string | null;
    mimeType: string;
};

export type GenerateUploadSignatureResponse = {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    uploadPreset: string;
};

export type CreateFileNodePayload = {
    name: string;
    parentId: string | null;
    mimeType: string;
    size: number;
    extension: string | null;
    cloudinaryPublicId: string;
    cloudinaryResourceType: string;
};

export type CloudinaryUploadResponse = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width?: number;
    height?: number;
    format?: string;
    resource_type: string;
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder?: boolean;
    url: string;
    secure_url: string;
    original_filename: string;
};

export type ApiSuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

export type ApiErrorResponse = {
    success: false;
    message: string;
    code?: string;
    details?: unknown;
    errors?: unknown;
};

export type FileAccessUrlResponse = {
    url: string;
};