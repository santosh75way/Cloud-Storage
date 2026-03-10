import { prisma } from "../../common/prisma";
import type { Prisma, PublicShareLink, Node } from "@prisma/client";

export class PublicLinksRepository {
    async createPublicLink(data: Prisma.PublicShareLinkUncheckedCreateInput): Promise<PublicShareLink> {
        return prisma.publicShareLink.create({ data });
    }

    async findPublicLinkById(id: string): Promise<PublicShareLink | null> {
        return prisma.publicShareLink.findUnique({ where: { id } });
    }

    async findPublicLinkByToken(token: string): Promise<PublicShareLink | null> {
        return prisma.publicShareLink.findUnique({ where: { token } });
    }

    async findPublicLinksByNodeId(nodeId: string): Promise<PublicShareLink[]> {
        return prisma.publicShareLink.findMany({
            where: { nodeId },
            orderBy: { createdAt: "desc" }
        });
    }

    async revokePublicLink(id: string): Promise<PublicShareLink> {
        return prisma.publicShareLink.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async findNodeById(nodeId: string): Promise<Node | null> {
        return prisma.node.findUnique({ where: { id: nodeId, deletedAt: null } });
    }
}
