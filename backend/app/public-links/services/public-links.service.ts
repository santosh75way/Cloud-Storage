import { PublicLinksRepository } from "../repositories/public-links.repository";
import type { CreatePublicLinkDto, PublicLinkResponseDto } from "../dto/public-links.dto";
import { AppError } from "../../common/errors/app-error";
import * as crypto from "crypto";
import { prisma } from "../../common/prisma";
import { v2 as cloudinaryV2 } from "cloudinary";
import type { Node } from "@prisma/client";

type AuthenticatedActor = {
    userId: string;
    role: "ADMIN" | "USER";
};

export class PublicLinksService {
    private readonly repository = new PublicLinksRepository();

    public async createPublicLink(
        actor: AuthenticatedActor,
        payload: CreatePublicLinkDto
    ): Promise<PublicLinkResponseDto> {
        if (actor.role !== "ADMIN") {
            throw new AppError("Only administrators can create public share links", 403, "FORBIDDEN");
        }

        const node = await this.repository.findNodeById(payload.nodeId);
        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const token = crypto.randomBytes(32).toString("hex");

        const link = await this.repository.createPublicLink({
            nodeId: payload.nodeId,
            token,
            createdByUserId: actor.userId,
            expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
        });

        return link as PublicLinkResponseDto;
    }

    public async listPublicLinksForNode(
        actor: AuthenticatedActor,
        nodeId: string
    ): Promise<PublicLinkResponseDto[]> {
        if (actor.role !== "ADMIN") {
            throw new AppError("Only administrators can list public share links", 403, "FORBIDDEN");
        }

        const node = await this.repository.findNodeById(nodeId);
        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const links = await this.repository.findPublicLinksByNodeId(nodeId);
        return links as PublicLinkResponseDto[];
    }

    public async revokePublicLink(
        actor: AuthenticatedActor,
        linkId: string
    ): Promise<PublicLinkResponseDto> {
        if (actor.role !== "ADMIN") {
            throw new AppError("Only administrators can revoke public share links", 403, "FORBIDDEN");
        }

        const link = await this.repository.findPublicLinkById(linkId);
        if (!link) {
            throw new AppError("Public link not found", 404, "LINK_NOT_FOUND");
        }

        const updated = await this.repository.revokePublicLink(linkId);
        return updated as PublicLinkResponseDto;
    }

    public async resolveActivePublicLink(token: string) {
        const link = await this.repository.findPublicLinkByToken(token);

        if (!link) {
            throw new AppError("Public link not found or invalid", 404, "LINK_NOT_FOUND");
        }

        if (!link.isActive) {
            throw new AppError("This public link has been revoked", 403, "LINK_REVOKED");
        }

        if (link.expiresAt && link.expiresAt.getTime() < Date.now()) {
            throw new AppError("This public link has expired", 403, "LINK_EXPIRED");
        }

        const node = await this.repository.findNodeById(link.nodeId);
        if (!node || node.deletedAt) {
            throw new AppError("The shared item no longer exists", 404, "NODE_NOT_FOUND");
        }

        return { link, node };
    }

    private async isNodeWithinPublicScope(rootNodeId: string, targetNodeId: string): Promise<boolean> {
        if (rootNodeId === targetNodeId) return true;

        const result = await prisma.$queryRaw<unknown[]>`
            WITH RECURSIVE NodeHierarchy AS (
                SELECT id, "parentId", "deletedAt"
                FROM nodes 
                WHERE id = ${targetNodeId} AND "deletedAt" IS NULL
                
                UNION ALL
                
                SELECT n.id, n."parentId", n."deletedAt"
                FROM nodes n
                INNER JOIN NodeHierarchy nh ON n.id = nh."parentId"
                WHERE n."deletedAt" IS NULL
            )
            SELECT 1 FROM NodeHierarchy WHERE id = ${rootNodeId};
        `;

        return Array.isArray(result) && result.length > 0;
    }

    public async publicGetNodeByToken(token: string) {
        const { node } = await this.resolveActivePublicLink(token);
        return {
            id: node.id,
            name: node.name,
            type: node.type,
            mimeType: node.mimeType,
            size: node.size,
            extension: node.extension,
            createdAt: node.createdAt,
            updatedAt: node.updatedAt,
            parentId: node.parentId
        };
    }

    public async publicListChildrenByToken(token: string, page: number = 1, limit: number = 50) {
        const { node } = await this.resolveActivePublicLink(token);

        if (node.type !== "FOLDER") {
            throw new AppError("The shared item is a file, not a folder", 400, "INVALID_NODE_TYPE");
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            prisma.node.findMany({
                where: { parentId: node.id, deletedAt: null },
                skip,
                take: limit,
                orderBy: [
                    { type: "desc" },
                    { name: "asc" },
                ],
                select: {
                    id: true,
                    name: true,
                    type: true,
                    mimeType: true,
                    size: true,
                    extension: true,
                    createdAt: true,
                    updatedAt: true,
                    parentId: true
                }
            }),
            prisma.node.count({
                where: { parentId: node.id, deletedAt: null },
            }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    public async publicGetBreadcrumbsByToken(token: string, targetNodeId?: string) {
        const { node: rootNode } = await this.resolveActivePublicLink(token);

        let currentNodeId = targetNodeId || rootNode.id;

        if (currentNodeId !== rootNode.id) {
            const isDescendant = await this.isNodeWithinPublicScope(rootNode.id, currentNodeId);
            if (!isDescendant) {
                throw new AppError("Access denied: Node is outside the public share scope", 403, "FORBIDDEN_SCOPE");
            }
        }

        const breadcrumbs = [];
        let current: Node | null = await this.repository.findNodeById(currentNodeId);

        while (current) {
            breadcrumbs.unshift({ id: current.id, name: current.name, type: current.type });
            if (current.id === rootNode.id) break;
            if (!current.parentId) break;
            current = await this.repository.findNodeById(current.parentId);
        }

        return { items: breadcrumbs };
    }

    private buildSignedFileAccessUrl(publicId: string, resourceType: string): string {
        const expiresInSeconds = 600; // 10 minutes
        const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

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

    public async publicGetFileAccessUrlByToken(token: string) {
        const { node } = await this.resolveActivePublicLink(token);

        if (node.type !== "FILE") {
            throw new AppError("The shared item is a folder, not a file", 400, "INVALID_NODE_TYPE");
        }

        if (!node.cloudinaryPublicId || !node.cloudinaryResourceType) {
            throw new AppError("File content not found", 404, "FILE_CONTENT_NOT_FOUND");
        }

        const url = this.buildSignedFileAccessUrl(node.cloudinaryPublicId, node.cloudinaryResourceType);

        return { url };
    }

    public async publicGetChildFileAccessUrl(token: string, targetNodeId: string) {
        const { node: rootNode } = await this.resolveActivePublicLink(token);

        if (rootNode.type !== "FOLDER") {
            throw new AppError("The public link scope is a file, not a folder", 400, "INVALID_SCOPE");
        }

        const isDescendant = await this.isNodeWithinPublicScope(rootNode.id, targetNodeId);
        if (!isDescendant) {
            throw new AppError("Access denied: File is outside the public share scope", 403, "FORBIDDEN_SCOPE");
        }

        const targetNode = await this.repository.findNodeById(targetNodeId);
        if (!targetNode || targetNode.deletedAt) {
            throw new AppError("File not found", 404, "FILE_NOT_FOUND");
        }

        if (targetNode.type !== "FILE") {
            throw new AppError("Requested node is not a file", 400, "INVALID_NODE_TYPE");
        }

        if (!targetNode.cloudinaryPublicId || !targetNode.cloudinaryResourceType) {
            throw new AppError("File content not found", 404, "FILE_CONTENT_NOT_FOUND");
        }

        const url = this.buildSignedFileAccessUrl(
            targetNode.cloudinaryPublicId,
            targetNode.cloudinaryResourceType
        );

        return { url };
    }
}
