import type { PrismaClient } from "@prisma/client";
import { AppError } from "../common/errors/app-error";
import { SharingRepository } from "./sharing.repository";
import type {
    CreateShareDto,
    ShareMutationActor,
    UpdateShareDto,
} from "./sharing.dto";

export class SharingService {
    private readonly sharingRepository: SharingRepository;

    constructor(private readonly prisma: PrismaClient) {
        this.sharingRepository = new SharingRepository(prisma);
    }

    private assertAdmin(actor: ShareMutationActor) {
        if (actor.role !== "ADMIN") {
            throw new AppError("Only admins can manage shares", 403, "FORBIDDEN");
        }
    }

    public async createShare(actor: ShareMutationActor, payload: CreateShareDto) {
        this.assertAdmin(actor);

        const node = await this.sharingRepository.findNodeById(payload.nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const user = await this.sharingRepository.findUserById(payload.sharedWithUserId);

        if (!user) {
            throw new AppError("Target user not found", 404, "TARGET_USER_NOT_FOUND");
        }

        if (actor.userId === payload.sharedWithUserId) {
            throw new AppError("You cannot share a node with yourself", 400, "INVALID_SHARE_TARGET");
        }

        const existingShare = await this.sharingRepository.findShareByNodeAndUser(
            payload.nodeId,
            payload.sharedWithUserId
        );

        if (existingShare) {
            throw new AppError(
                "This node is already shared with the selected user",
                409,
                "SHARE_ALREADY_EXISTS"
            );
        }

        const share = await this.sharingRepository.createShare({
            nodeId: payload.nodeId,
            sharedByUserId: actor.userId,
            sharedWithUserId: payload.sharedWithUserId,
            permission: payload.permission,
        });

        return share;
    }

    public async listSharesForNode(actor: ShareMutationActor, nodeId: string, page: number = 1, limit: number = 20) {
        this.assertAdmin(actor);

        const node = await this.sharingRepository.findNodeById(nodeId);

        if (!node || node.deletedAt) {
            throw new AppError("Node not found", 404, "NODE_NOT_FOUND");
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.sharingRepository.findSharesByNodeId(nodeId, skip, limit),
            this.sharingRepository.countSharesByNodeId(nodeId)
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }

    public async updateShare(actor: ShareMutationActor, shareId: string, payload: UpdateShareDto) {
        this.assertAdmin(actor);

        const share = await this.sharingRepository.findShareById(shareId);

        if (!share) {
            throw new AppError("Share not found", 404, "SHARE_NOT_FOUND");
        }

        const updatedShare = await this.sharingRepository.updateSharePermission({
            shareId,
            permission: payload.permission,
        });

        return updatedShare;
    }

    public async deleteShare(actor: ShareMutationActor, shareId: string) {
        this.assertAdmin(actor);

        const share = await this.sharingRepository.findShareById(shareId);

        if (!share) {
            throw new AppError("Share not found", 404, "SHARE_NOT_FOUND");
        }

        const deletedShare = await this.sharingRepository.deleteShare(shareId);

        return deletedShare;
    }

    public async getSharedWithMe(actor: ShareMutationActor, page: number = 1, limit: number = 5) {
        const skip = (page - 1) * limit;

        const [sharedItems, total] = await Promise.all([
            this.sharingRepository.findNodesSharedWithUser(actor.userId, skip, limit),
            this.sharingRepository.countNodesSharedWithUser(actor.userId)
        ]);

        const items = sharedItems.map((item: Awaited<ReturnType<SharingRepository["findNodesSharedWithUser"]>>[number]) => ({
            shareId: item.id,
            permission: item.permission,
            nodeId: item.node.id,
            nodeName: item.node.name,
            nodeType: item.node.type,
            ownerId: item.node.ownerId,
            sharedAt: item.createdAt,
            mimeType: item.node.mimeType,
            size: item.node.size,
            extension: item.node.extension,
        }));

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
}