import type { Request, Response, NextFunction } from "express";
import { prisma } from "@/common";
import { SearchService } from "./search.service";
import { searchQuerySchema } from "./search.schemas";

const searchService = new SearchService(prisma);

// We define this interface explicitly or re-export it from auth typings
type AuthenticatedRequestUser = {
    userId: string;
    role: "ADMIN" | "USER";
};

type AuthenticatedRequest = Request & {
    user: AuthenticatedRequestUser;
};

export class SearchController {
    public async search(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedQuery = searchQuerySchema.parse(req.query);

            const result = await searchService.searchNodes(parsedQuery, {
                userId: authenticatedReq.user.userId,
                role: authenticatedReq.user.role,
            });

            return res.status(200).json({
                success: true,
                message: "Search completed successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export const searchController = new SearchController();
