import type { SearchQueryDto, SearchActor } from "./search.dto";
import { SearchRepository } from "./search.repository";
import { permissionService } from "../sharing/permission.service";
import type { PrismaClient } from "@prisma/client";
import type { ResolvedAccessLevel } from "../sharing/access.dto";

export class SearchService {
    private readonly searchRepository: SearchRepository;

    constructor(private readonly prisma: PrismaClient) {
        this.searchRepository = new SearchRepository(prisma);
    }

    public async searchNodes(params: SearchQueryDto, actor: SearchActor) {
        // 1. Fetch potential matching nodes from the database (applying DB-level filters)
        const candidates = await this.searchRepository.findCandidates(
            params,
            actor.userId
        );

        const readableNodes = [];

        // 2. Resolve permissions manually for each candidate
        for (const node of candidates) {
            const accessLevel = await permissionService.resolveNodeAccess(
                { userId: actor.userId, role: actor.role },
                node.id
            );

            if (accessLevel !== "NONE") {
                // Additional business logic for "SHARED_WITH_ME"
                // If a node is owned by the user, it is not "Shared with them", it belongs to them.
                if (
                    params.sharedStatus === "SHARED_WITH_ME" &&
                    node.ownerId === actor.userId
                ) {
                    continue;
                }

                readableNodes.push({
                    ...node,
                    accessLevel,
                });
            }
        }

        // 3. Apply memory pagination
        const total = readableNodes.length;
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;

        const items = readableNodes.slice(startIndex, endIndex);
        const totalPages = Math.ceil(total / params.limit) || 1;

        return {
            items,
            total,
            page: params.page,
            limit: params.limit,
            totalPages,
        };
    }
}
