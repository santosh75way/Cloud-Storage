import type { PrismaClient } from "@prisma/client";
import { prisma } from "@/common";
import { SharingRepository } from "./sharing.repository";
import type { AccessActor, ResolvedAccessLevel } from "./access.dto";

export class PermissionService {
  private readonly sharingRepository: SharingRepository;

  constructor(private readonly prisma: PrismaClient) {
    this.sharingRepository = new SharingRepository(prisma);
  }

  public async resolveNodeAccess(
    actor: AccessActor,
    nodeId: string
  ): Promise<ResolvedAccessLevel> {
    const node = await this.sharingRepository.findNodeById(nodeId);

    if (!node || node.deletedAt) {
      return "NONE";
    }

    if (actor.role === "ADMIN" || node.ownerId === actor.userId) {
      return "OWNER";
    }

    const ancestorChain = await this.sharingRepository.findAncestorChainForAccess(nodeId);

    const validNodeIds = ancestorChain
      .filter((n: { id: string; deleted_at: Date | null }) => !n.deleted_at)
      .map((n: { id: string }) => n.id);

    if (validNodeIds.length === 0) {
      return "NONE";
    }

    const shares = await this.sharingRepository.findSharesForUserOnNodes(
      actor.userId,
      validNodeIds
    );

    if (shares.length === 0) {
      return "NONE";
    }

    const shareMap = new Map();
    for (const share of shares) {
      shareMap.set(share.nodeId, share.permission);
    }

    for (let i = 0; i < ancestorChain.length; i++) {
      const currentId = ancestorChain[i].id;
      if (shareMap.has(currentId)) {
        return shareMap.get(currentId) === "EDIT" ? "EDIT" : "VIEW";
      }
    }

    return "NONE";
  }

  public canRead(accessLevel: ResolvedAccessLevel): boolean {
    return accessLevel === "OWNER" || accessLevel === "EDIT" || accessLevel === "VIEW";
  }

  public canEdit(accessLevel: ResolvedAccessLevel): boolean {
    return accessLevel === "OWNER" || accessLevel === "EDIT";
  }
}

export const permissionService = new PermissionService(prisma);