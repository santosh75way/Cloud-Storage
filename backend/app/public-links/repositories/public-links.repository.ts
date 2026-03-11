import { prisma } from "../../common/prisma";
import type { Prisma, PublicShareLink, Node } from "@prisma/client";

export class PublicLinksRepository {
    async createPublicLink(data: { nodeId: string, token: string, createdByUserId: string, expiresAt: Date | null }): Promise<PublicShareLink> {
        return prisma.publicShareLink.create({
            data: {
                token: data.token,
                expiresAt: data.expiresAt,
                node: { connect: { id: data.nodeId } },
                createdByUser: { connect: { id: data.createdByUserId } }
            }
        });
    }

    async findPublicLinkById(id: string): Promise<PublicShareLink | null> {
        return prisma.publicShareLink.findUnique({ where: { id } });
    }

    async findPublicLinkByToken(token: string): Promise<PublicShareLink | null> {
        return prisma.publicShareLink.findUnique({ where: { token } });
    }

    async findPublicLinksByNodeId(nodeId: string, skip: number, take: number): Promise<PublicShareLink[]> {
        return prisma.publicShareLink.findMany({
            where: { nodeId },
            orderBy: { createdAt: "desc" },
            skip,
            take,
        });
    }

    async countPublicLinksByNodeId(nodeId: string): Promise<number> {
        return prisma.publicShareLink.count({
            where: { nodeId },
        });
    }

    async revokePublicLink(id: string): Promise<PublicShareLink> {
        return prisma.publicShareLink.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async deletePublicLink(id: string): Promise<PublicShareLink> {
        return prisma.publicShareLink.delete({
            where: { id },
        });
    }

    async findNodeById(nodeId: string): Promise<Node | null> {
        return prisma.node.findUnique({ where: { id: nodeId, deletedAt: null } });
    }
}
