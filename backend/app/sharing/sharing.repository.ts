import type { PrismaClient, SharePermission } from "@prisma/client";

type CreateShareRecordInput = {
    nodeId: string;
    sharedByUserId: string;
    sharedWithUserId: string;
    permission: SharePermission;
};

type UpdateShareRecordInput = {
    shareId: string;
    permission: SharePermission;
};

export class SharingRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async findUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
            },
        });
    }

    public async findNodeById(nodeId: string) {
        return this.prisma.node.findUnique({
            where: {
                id: nodeId,
            },
            select: {
                id: true,
                name: true,
                type: true,
                ownerId: true,
                deletedAt: true,
            },
        });
    }

    public async findShareById(shareId: string) {
        return this.prisma.share.findUnique({
            where: {
                id: shareId,
            },
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async findShareByNodeAndUser(nodeId: string, sharedWithUserId: string) {
        return this.prisma.share.findUnique({
            where: {
                nodeId_sharedWithUserId: {
                    nodeId,
                    sharedWithUserId,
                },
            },
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async createShare(data: CreateShareRecordInput) {
        return this.prisma.share.create({
            data: {
                nodeId: data.nodeId,
                sharedByUserId: data.sharedByUserId,
                sharedWithUserId: data.sharedWithUserId,
                permission: data.permission,
            },
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async updateSharePermission(data: UpdateShareRecordInput) {
        return this.prisma.share.update({
            where: {
                id: data.shareId,
            },
            data: {
                permission: data.permission,
            },
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async deleteShare(shareId: string) {
        return this.prisma.share.delete({
            where: {
                id: shareId,
            },
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async findSharesByNodeId(nodeId: string, skip: number, take: number) {
        return this.prisma.share.findMany({
            where: {
                nodeId,
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
            skip,
            take,
            include: {
                sharedWithUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async countSharesByNodeId(nodeId: string) {
        return this.prisma.share.count({
            where: {
                nodeId,
            },
        });
    }

    public async findNodesSharedWithUser(sharedWithUserId: string, skip: number, take: number) {
        return this.prisma.share.findMany({
            where: {
                sharedWithUserId,
                node: {
                    deletedAt: null,
                },
            },
            orderBy: [
                {
                    createdAt: "desc",
                },
            ],
            skip,
            take,
            include: {
                node: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        parentId: true,
                        ownerId: true,
                        createdAt: true,
                        updatedAt: true,
                        mimeType: true,
                        size: true,
                        extension: true,
                    },
                },
                sharedByUser: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
        });
    }

    public async countNodesSharedWithUser(sharedWithUserId: string) {
        return this.prisma.share.count({
            where: {
                sharedWithUserId,
                node: {
                    deletedAt: null,
                },
            },
        });
    }

    public async findAncestorChainForAccess(nodeId: string) {
        const result = await this.prisma.$queryRaw<{ id: string; parent_id: string | null; deleted_at: Date | null }[]>`
      WITH RECURSIVE AncestorTree AS (
        SELECT id, "parentId" AS parent_id, "deletedAt" AS deleted_at, 1 as level
        FROM "nodes"
        WHERE id = ${nodeId}
        
        UNION ALL
        
        SELECT n.id, n."parentId" AS parent_id, n."deletedAt" AS deleted_at, at.level + 1
        FROM "nodes" n
        INNER JOIN AncestorTree at ON at.parent_id = n.id
      )
      SELECT id, parent_id, deleted_at FROM AncestorTree ORDER BY level ASC;
    `;
        return result;
    }

    public async findSharesForUserOnNodes(sharedWithUserId: string, nodeIds: string[]) {
        if (nodeIds.length === 0) return [];

        return this.prisma.share.findMany({
            where: {
                sharedWithUserId,
                nodeId: {
                    in: nodeIds
                }
            },
            select: {
                nodeId: true,
                permission: true
            }
        });
    }
}