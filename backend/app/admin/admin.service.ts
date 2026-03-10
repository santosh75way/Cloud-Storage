import { PrismaClient } from "@prisma/client";

export class AdminService {
    constructor(private readonly prisma: PrismaClient) { }

    public async getRecentShares(page: number = 1, limit: number = 5) {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.prisma.share.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    node: { select: { name: true, type: true } },
                    sharedByUser: { select: { fullName: true, email: true } },
                    sharedWithUser: { select: { fullName: true, email: true } },
                }
            }),
            this.prisma.share.count()
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    public async getActivityFeed(page: number = 1, limit: number = 10) {
        // Compute memory union pagination
        const itemsToFetch = page * limit;

        const [recentNodes, recentShares, totalNodes, totalShares] = await Promise.all([
            this.prisma.node.findMany({
                take: itemsToFetch,
                orderBy: { createdAt: "desc" },
                include: { owner: { select: { fullName: true } } }
            }),
            this.prisma.share.findMany({
                take: itemsToFetch,
                orderBy: { createdAt: "desc" },
                include: {
                    node: { select: { name: true } },
                    sharedByUser: { select: { fullName: true } },
                    sharedWithUser: { select: { fullName: true } }
                }
            }),
            this.prisma.node.count(),
            this.prisma.share.count()
        ]);

        const total = totalNodes + totalShares;

        const activities: { type: string; id: string; actor: string; target: string; targetUser?: string; timestamp: Date }[] = [];

        recentNodes.forEach(node => {
            activities.push({
                type: "NODE_CREATED",
                id: `node-${node.id}`,
                actor: node.owner.fullName,
                target: node.name,
                timestamp: node.createdAt,
            });
        });

        recentShares.forEach(share => {
            activities.push({
                type: "SHARE_CREATED",
                id: `share-${share.id}`,
                actor: share.sharedByUser.fullName,
                target: share.node.name,
                targetUser: share.sharedWithUser.fullName,
                timestamp: share.createdAt,
            });
        });

        activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        return {
            items: activities.slice(startIndex, endIndex),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
}
