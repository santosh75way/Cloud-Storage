import type { NodeType } from "@prisma/client";

export type CreateFolderDto = {
    name: string;
    parentId: string | null;
};

export type RenameNodeDto = {
    name: string;
};

export type ListChildrenQueryDto = {
    page: number;
    limit: number;
};

export type NodeListItemDto = {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PaginatedNodeListDto = {
    items: NodeListItemDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type BreadcrumbItemDto = {
    id: string;
    name: string;
    type: NodeType;
    parentId: string | null;
};

export type NodeBreadcrumbsDto = {
    items: BreadcrumbItemDto[];
};

export type GenerateUploadSignatureDto = {
    fileName: string;
    folderId: string | null;
    mimeType: string;
};

export type CreateFileNodeDto = {
    name: string;
    parentId: string | null;
    mimeType: string;
    size: number;
    extension: string | null;
    cloudinaryPublicId: string;
    cloudinaryResourceType: string;
};

export type FileAccessUrlDto = {
    url: string;
};