import type { Prisma, PrismaClient } from "@prisma/client";


type CreateFolderRecordInput = {
    name: string;
    parentId: string | null;
    ownerId: string;
};

type CreateFileRecordInput = {
    name: string;
    parentId: string | null;
    ownerId: string;
    mimeType: string;
    size: number;
    extension: string | null;
    cloudinaryPublicId: string;
    cloudinaryResourceType: string;
};

type FindChildrenParams = {
    parentId: string | null;
    ownerId?: string;
    skip: number;
    take: number;
};

type RenameNodeParams = {
    nodeId: string;
    name: string;
};

type SoftDeleteNodeParams = {
    nodeId: string;
    deletedAt: Date;
};

export class StorageRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async findNodeById(id: string) {
        return this.prisma.node.findUnique({
            where: { id },
        });
    }

    public async createFolder(data: CreateFolderRecordInput) {
        return this.prisma.node.create({
            data: {
                name: data.name,
                type: "FOLDER",
                parentId: data.parentId,
                ownerId: data.ownerId,
            },
        });
    }

    public async createFile(data: CreateFileRecordInput) {
        return this.prisma.node.create({
            data: {
                name: data.name,
                type: "FILE",
                parentId: data.parentId,
                ownerId: data.ownerId,
                mimeType: data.mimeType,
                size: data.size,
                extension: data.extension,
                cloudinaryPublicId: data.cloudinaryPublicId,
                cloudinaryResourceType: data.cloudinaryResourceType,
            },
        });
    }

    public async countChildren(parentId: string | null, ownerId?: string) {
        return this.prisma.node.count({
            where: {
                parentId,
                ...(ownerId ? { ownerId } : {}),
                deletedAt: null,
            },
        });
    }

    public async findChildren(params: FindChildrenParams) {
        return this.prisma.node.findMany({
            where: {
                parentId: params.parentId,
                ...(params.ownerId ? { ownerId: params.ownerId } : {}),
                deletedAt: null,
            },
            orderBy: [{ type: "asc" }, { name: "asc" }],
            skip: params.skip,
            take: params.take,
            select: {
                id: true,
                name: true,
                type: true,
                parentId: true,
                ownerId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    public async isSiblingNameTaken(params: {
        parentId: string | null;
        name: string;
        excludeNodeId?: string;
    }) {
        const existingNode = await this.prisma.node.findFirst({
            where: {
                parentId: params.parentId,
                name: params.name,
                deletedAt: null,
                ...(params.excludeNodeId
                    ? {
                        id: {
                            not: params.excludeNodeId,
                        },
                    }
                    : {}),
            },
            select: {
                id: true,
            },
        });

        return Boolean(existingNode);
    }

    public async renameNode(params: RenameNodeParams) {
        return this.prisma.node.update({
            where: {
                id: params.nodeId,
            },
            data: {
                name: params.name,
            },
        });
    }

    public async softDeleteNode(params: SoftDeleteNodeParams) {
        return this.prisma.node.update({
            where: {
                id: params.nodeId,
            },
            data: {
                deletedAt: params.deletedAt,
            },
        });
    }

    public async hasActiveChildren(nodeId: string) {
        const child = await this.prisma.node.findFirst({
            where: {
                parentId: nodeId,
                deletedAt: null,
            },
            select: {
                id: true,
            },
        });

        return Boolean(child);
    }

    public async findAncestorChain(nodeId: string) {
        const rows = await this.prisma.$queryRaw<
            Array<{
                id: string;
                name: string;
                type: "FILE" | "FOLDER";
                parent_id: string | null;
                depth: number;
                deleted_at: Date | null;
            }>
        >`
      WITH RECURSIVE ancestors AS (
        SELECT
          id,
          name,
          type,
          "parentId" AS parent_id,
          "deletedAt" AS deleted_at,
          0 AS depth
        FROM "nodes"
        WHERE id = ${nodeId}

        UNION ALL

        SELECT
          parent.id,
          parent.name,
          parent.type,
          parent."parentId" AS parent_id,
          parent."deletedAt" AS deleted_at,
          ancestors.depth + 1 AS depth
        FROM "nodes" parent
        INNER JOIN ancestors ON ancestors.parent_id = parent.id
      )
      SELECT id, name, type, parent_id, depth, deleted_at
      FROM ancestors
      ORDER BY depth DESC;
    `;

        return rows;
    }

    public async runInTransaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
        return this.prisma.$transaction((tx) => callback(tx));
    }
}