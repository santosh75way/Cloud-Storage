import type { PrismaClient } from "@prisma/client";
import { v2 as cloudinaryV2 } from "cloudinary";
import { AppError } from "../common/errors/app-error";
import { env } from "../common/config/env";
import { StorageRepository } from "./storage.repository";
import { permissionService } from "../sharing/permission.service";
import type {
    CreateFileNodeDto,
    CreateFolderDto,
    ListChildrenQueryDto,
    PaginatedNodeListDto,
    RenameNodeDto,
    GenerateUploadSignatureDto,
    FileAccessUrlDto,
} from "./storage.dto";

type AuthenticatedActor = {
    userId: string;
    role: "ADMIN" | "USER";
};

type CloudinaryUploadSignatureResult = {
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
    uploadPreset: string;
};

export class StorageService {
    private readonly storageRepository: StorageRepository;

    constructor(private readonly prisma: PrismaClient) {
        this.storageRepository = new StorageRepository(prisma);
    }

    private async assertFolderExistsForWriteAccess(
        actor: AuthenticatedActor,
        parentId: string | null
    ): Promise<void> {
        if (!parentId) {
            return;
        }

        const parentNode = await this.storageRepository.findNodeById(parentId);

        if (!parentNode || parentNode.deletedAt) {
            throw new AppError("Parent folder not found", 404, "PARENT_FOLDER_NOT_FOUND");
        }

        if (parentNode.type !== "FOLDER") {
            throw new AppError("Parent must be a folder", 400, "INVALID_PARENT_NODE");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, parentId);

        if (!permissionService.canEdit(accessLevel)) {
            throw new AppError(
                "You do not have permission to upload into this folder",
                403,
                "FORBIDDEN"
            );
        }
    }

    public async createFolder(actor: AuthenticatedActor, payload: CreateFolderDto) {
        if (payload.parentId) {
            const parentNode = await this.storageRepository.findNodeById(payload.parentId);

            if (!parentNode || parentNode.deletedAt) {
                throw new AppError("Parent folder not found", 404, "PARENT_FOLDER_NOT_FOUND");
            }

            if (parentNode.type !== "FOLDER") {
                throw new AppError("Parent must be a folder", 400, "INVALID_PARENT_NODE");
            }
        }

        const siblingNameTaken = await this.storageRepository.isSiblingNameTaken({
            parentId: payload.parentId,
            name: payload.name,
        });

        if (siblingNameTaken) {
            throw new AppError(
                "A file or folder with the same name already exists in this location",
                409,
                "SIBLING_NAME_CONFLICT"
            );
        }

        const folder = await this.storageRepository.createFolder({
            name: payload.name,
            parentId: payload.parentId,
            ownerId: actor.userId,
        });

        return folder;
    }

    private buildSignedFileAccessUrl(publicId: string, resourceType: string): string {
        const expiresInSeconds = 600; // 10 minutes
        const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

        if (resourceType === "image") {
            return cloudinaryV2.url(publicId, {
                secure: true,
                sign_url: true,
                resource_type: "image",
                type: "upload",
                fetch_format: "auto",
                quality: "auto",
            });
        }

        return cloudinaryV2.utils.private_download_url(
            publicId,
            "",
            {
                resource_type: resourceType,
                type: "upload",
                expires_at: expiresAt,
            }
        );
    }

    public async getFileAccessUrl(actor: AuthenticatedActor, nodeId: string) {
        const node = await this.storageRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("File not found", 404, "FILE_NOT_FOUND");
        }

        if (node.type !== "FILE") {
            throw new AppError("Access URL can only be generated for files", 400, "INVALID_FILE_NODE");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, nodeId);

        if (!permissionService.canRead(accessLevel)) {
            throw new AppError("You do not have permission to access this file", 403, "FORBIDDEN");
        }

        if (!node.cloudinaryPublicId || !node.cloudinaryResourceType) {
            throw new AppError("File storage metadata is missing", 500, "FILE_STORAGE_METADATA_MISSING");
        }

        const url = this.buildSignedFileAccessUrl(
            node.cloudinaryPublicId,
            node.cloudinaryResourceType
        );

        return {
            url,
        };
    }

    public async getNodeById(actor: AuthenticatedActor, nodeId: string) {
        const node = await this.storageRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, nodeId);

        if (!permissionService.canRead(accessLevel)) {
            throw new AppError("You do not have permission to access this node", 403, "FORBIDDEN");
        }

        return {
            ...node,
            accessLevel,
        };
    }

    public async getBreadcrumbs(actor: AuthenticatedActor, nodeId: string) {
        const node = await this.storageRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, nodeId);

        if (!permissionService.canRead(accessLevel)) {
            throw new AppError("You do not have permission to view this specific location", 403, "FORBIDDEN");
        }

        const ancestors = await this.storageRepository.findAncestorChain(nodeId);

        const items = ancestors
            .filter((item: Awaited<ReturnType<StorageRepository["findAncestorChain"]>>[number]) => item.deleted_at === null)
            .map((item: Awaited<ReturnType<StorageRepository["findAncestorChain"]>>[number]) => ({
                id: item.id,
                name: item.name,
                type: item.type,
                parentId: item.parent_id,
            }));

        return {
            items,
        };
    }

    public async listChildren(
        actor: AuthenticatedActor,
        parentId: string | null,
        query: ListChildrenQueryDto
    ): Promise<PaginatedNodeListDto> {
        if (parentId) {
            const parentNode = await this.storageRepository.findNodeById(parentId);

            if (!parentNode || parentNode.deletedAt) {
                throw new AppError("Folder not found", 404, "FOLDER_NOT_FOUND");
            }

            if (parentNode.type !== "FOLDER") {
                throw new AppError("Children can only be listed for folders", 400, "INVALID_FOLDER_NODE");
            }

            const accessLevel = await permissionService.resolveNodeAccess(actor, parentId);
            if (!permissionService.canRead(accessLevel)) {
                throw new AppError("You do not have permission to view this folder", 403, "FORBIDDEN");
            }
        }

        const skip = (query.page - 1) * query.limit;
        const ownerIdFilter = parentId === null ? actor.userId : undefined;

        const [total, items] = await Promise.all([
            this.storageRepository.countChildren(parentId, ownerIdFilter),
            this.storageRepository.findChildren({
                parentId,
                ownerId: ownerIdFilter,
                skip,
                take: query.limit,
            }),
        ]);

        const itemsWithAccess = await Promise.all(
            items.map(async (item: Awaited<ReturnType<StorageRepository["findChildren"]>>[number]) => ({
                ...item,
                accessLevel: await permissionService.resolveNodeAccess(actor, item.id)
            }))
        );

        return {
            items: itemsWithAccess,
            total,
            page: query.page,
            limit: query.limit,
            totalPages: Math.ceil(total / query.limit),
        };
    }

    public async renameNode(actor: AuthenticatedActor, nodeId: string, payload: RenameNodeDto) {
        const node = await this.storageRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, nodeId);

        if (!permissionService.canEdit(accessLevel)) {
            throw new AppError("You do not have permission to rename this node", 403, "FORBIDDEN");
        }

        if (node.name === payload.name) {
            return node;
        }

        const siblingNameTaken = await this.storageRepository.isSiblingNameTaken({
            parentId: node.parentId,
            name: payload.name,
            excludeNodeId: node.id,
        });

        if (siblingNameTaken) {
            throw new AppError(
                "A file or folder with the same name already exists in this location",
                409,
                "SIBLING_NAME_CONFLICT"
            );
        }

        const renamedNode = await this.storageRepository.renameNode({
            nodeId: node.id,
            name: payload.name,
        });

        return renamedNode;
    }

    public async deleteNode(actor: AuthenticatedActor, nodeId: string) {
        const node = await this.storageRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const accessLevel = await permissionService.resolveNodeAccess(actor, nodeId);

        if (!permissionService.canEdit(accessLevel)) {
            throw new AppError("You do not have permission to delete this node", 403, "FORBIDDEN");
        }

        if (node.type === "FOLDER") {
            const hasActiveChildren = await this.storageRepository.hasActiveChildren(node.id);

            if (hasActiveChildren) {
                throw new AppError(
                    "Folder cannot be deleted because it still contains active items",
                    409,
                    "FOLDER_NOT_EMPTY"
                );
            }
        }

        const deletedNode = await this.storageRepository.softDeleteNode({
            nodeId: node.id,
            deletedAt: new Date(),
        });

        return deletedNode;
    }

    public async generateUploadSignature(
        actor: AuthenticatedActor,
        payload: GenerateUploadSignatureDto
    ): Promise<CloudinaryUploadSignatureResult> {
        await this.assertFolderExistsForWriteAccess(actor, payload.folderId);

        const timestamp = Math.floor(Date.now() / 1000);
        const folder = `${env.CLOUDINARY_UPLOAD_FOLDER}/${actor.userId}`;
        const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET;

        const signature = cloudinaryV2.utils.api_sign_request(
            {
                timestamp,
                folder,
                upload_preset: uploadPreset,
            },
            env.CLOUDINARY_API_SECRET
        );

        return {
            timestamp,
            signature,
            apiKey: env.CLOUDINARY_API_KEY,
            cloudName: env.CLOUDINARY_CLOUD_NAME,
            folder,
            uploadPreset,
        };
    }

    public async createFileNode(actor: AuthenticatedActor, payload: CreateFileNodeDto) {
        await this.assertFolderExistsForWriteAccess(actor, payload.parentId);

        const siblingNameTaken = await this.storageRepository.isSiblingNameTaken({
            parentId: payload.parentId,
            name: payload.name,
        });

        if (siblingNameTaken) {
            throw new AppError(
                "A file or folder with the same name already exists in this location",
                409,
                "SIBLING_NAME_CONFLICT"
            );
        }

        const fileNode = await this.storageRepository.createFile({
            name: payload.name,
            parentId: payload.parentId,
            ownerId: actor.userId,
            mimeType: payload.mimeType,
            size: payload.size,
            extension: payload.extension,
            cloudinaryPublicId: payload.cloudinaryPublicId,
            cloudinaryResourceType: payload.cloudinaryResourceType,
        });

        return fileNode;
    }
}