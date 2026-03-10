import type { NextFunction, Request, Response } from "express";
import { PublicLinksService } from "../services/public-links.service";
import { createPublicLinkSchema } from "../schemas/public-links.schemas";

type AuthenticatedRequestUser = {
    id: string;
    role: "ADMIN" | "USER";
};

type AuthenticatedRequest = Request & {
    user: AuthenticatedRequestUser;
};

const publicLinksService = new PublicLinksService();

export class PublicLinksController {

    // --- Admin Endpoints ---

    public async createPublicLink(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedBody = createPublicLinkSchema.parse(req.body);

            const link = await publicLinksService.createPublicLink(
                {
                    userId: authenticatedReq.user.id,
                    role: authenticatedReq.user.role,
                },
                parsedBody.body
            );

            return res.status(201).json({
                success: true,
                message: "Public share link created successfully",
                data: link,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async listPublicLinksForNode(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.nodeId;

            const links = await publicLinksService.listPublicLinksForNode(
                {
                    userId: authenticatedReq.user.id,
                    role: authenticatedReq.user.role,
                },
                nodeId
            );

            return res.status(200).json({
                success: true,
                message: "Public links fetched successfully",
                data: links,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async revokePublicLink(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const linkId = req.params.id;

            const updatedLink = await publicLinksService.revokePublicLink(
                {
                    userId: authenticatedReq.user.id,
                    role: authenticatedReq.user.role,
                },
                linkId
            );

            return res.status(200).json({
                success: true,
                message: "Public link revoked successfully",
                data: updatedLink,
            });
        } catch (error) {
            return next(error);
        }
    }

    // --- Anonymous Public Endpoints ---

    public async publicGetNode(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;
            const node = await publicLinksService.publicGetNodeByToken(token);

            return res.status(200).json({
                success: true,
                message: "Shared node fetched successfully",
                data: node,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async publicListChildren(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;

            const result = await publicLinksService.publicListChildrenByToken(token, page, limit);

            return res.status(200).json({
                success: true,
                message: "Shared folder children fetched successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async publicGetBreadcrumbs(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;
            const targetNodeId = req.query.nodeId as string | undefined;

            const breadcrumbs = await publicLinksService.publicGetBreadcrumbsByToken(token, targetNodeId);

            return res.status(200).json({
                success: true,
                message: "Breadcrumbs fetched successfully",
                data: breadcrumbs,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async publicGetFileAccessUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;
            const result = await publicLinksService.publicGetFileAccessUrlByToken(token);

            return res.status(200).json({
                success: true,
                message: "File access URL generated successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async publicGetChildFileAccessUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.params.token;
            const nodeId = req.params.nodeId;
            const result = await publicLinksService.publicGetChildFileAccessUrl(token, nodeId);

            return res.status(200).json({
                success: true,
                message: "Child file access URL generated successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export const publicLinksController = new PublicLinksController();
