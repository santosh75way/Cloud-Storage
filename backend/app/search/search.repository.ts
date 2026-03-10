import type { PrismaClient, Prisma } from "@prisma/client";
import type { SearchQueryDto } from "./search.dto";

export class SearchRepository {
    constructor(private readonly prisma: PrismaClient) { }

    public async findCandidates(
        params: SearchQueryDto,
        actorUserId: string
    ) {
        const where: Prisma.NodeWhereInput = {
            deletedAt: null,
        };

        if (params.q) {
            where.name = {
                contains: params.q,
                mode: "insensitive",
            };
        }

        if (params.type) {
            where.type = params.type;
        }

        // Handle Ownership
        if (params.ownership === "MINE") {
            where.ownerId = actorUserId;
        } else if (params.ownership === "NOT_MINE") {
            where.ownerId = { not: actorUserId };
        }

        // Handle Shared Status
        if (params.sharedStatus === "SHARED_BY_ME") {
            where.shares = {
                some: { sharedByUserId: actorUserId },
            };
        } else if (params.sharedStatus === "PUBLIC_LINKED") {
            where.publicLinks = {
                some: { isActive: true },
            };
        } else if (params.sharedStatus === "SHARED_WITH_ME") {
            // It must not be owned by the actor
            // The actual "has access" check will happen in the service layer's resolveNodeAccess
            if (!where.ownerId) {
                where.ownerId = { not: actorUserId };
            } else if (typeof where.ownerId === "string" && where.ownerId === actorUserId) {
                // Conflicting filter: "MINE" + "SHARED_WITH_ME" is mathematically empty for ordinary rules,
                // but let's let Prisma return empty or safely build the query.
                where.ownerId = "CONFLICT_CONDITION";
            }
        }

        return this.prisma.node.findMany({
            where,
            orderBy: [
                { type: "asc" },
                { name: "asc" },
            ],
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
        });
    }
}
