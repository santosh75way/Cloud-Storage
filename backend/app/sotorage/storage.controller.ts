import type { Request, Response, NextFunction } from "express";
import { StorageService } from "./storage.service";
import { prisma } from "@/common";

const storageService = new StorageService(prisma);
import {
    createFileNodeSchema,
    createFolderSchema,
    generateUploadSignatureSchema,
    listChildrenQuerySchema,
    renameNodeSchema,
} from "./storage.schemas";

type AuthenticatedRequestUser = {
    userId: string;
    role: "ADMIN" | "USER";
};

type AuthenticatedRequest = Request & {
    user: AuthenticatedRequestUser;
};

export class StorageController {
    public async createFolder(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedBody = createFolderSchema.parse(req.body);

            const folder = await storageService.createFolder(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                {
                    name: parsedBody.name,
                    parentId: parsedBody.parentId,
                }
            );

            return res.status(201).json({
                success: true,
                message: "Folder created successfully",
                data: folder,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async generateUploadSignature(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedBody = generateUploadSignatureSchema.parse(req.body);

            const result = await storageService.generateUploadSignature(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                {
                    fileName: parsedBody.fileName,
                    folderId: parsedBody.folderId,
                    mimeType: parsedBody.mimeType,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Upload signature generated successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async createFileNode(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedBody = createFileNodeSchema.parse(req.body);

            const fileNode = await storageService.createFileNode(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                {
                    name: parsedBody.name,
                    parentId: parsedBody.parentId,
                    mimeType: parsedBody.mimeType,
                    size: parsedBody.size,
                    extension: parsedBody.extension,
                    cloudinaryPublicId: parsedBody.cloudinaryPublicId,
                    cloudinaryResourceType: parsedBody.cloudinaryResourceType,
                }
            );

            return res.status(201).json({
                success: true,
                message: "File created successfully",
                data: fileNode,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async getNodeById(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.id;

            const node = await storageService.getNodeById(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                nodeId
            );

            return res.status(200).json({
                success: true,
                message: "Node fetched successfully",
                data: node,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async getFileAccessUrl(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.id;

            const accessUrlDto = await storageService.getFileAccessUrl(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                nodeId
            );

            return res.status(200).json({
                success: true,
                message: "File access URL generated successfully",
                data: accessUrlDto,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async getBreadcrumbs(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.id;
            const breadcrumbs = await storageService.getBreadcrumbs(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                nodeId
            );

            return res.status(200).json({
                success: true,
                message: "Breadcrumbs fetched successfully",
                data: breadcrumbs,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async listRootChildren(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parsedQuery = listChildrenQuerySchema.parse(req.query);

            const result = await storageService.listChildren(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                null,
                {
                    page: parsedQuery.page,
                    limit: parsedQuery.limit,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Root children fetched successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async listFolderChildren(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const parentId = req.params.id;
            const parsedQuery = listChildrenQuerySchema.parse(req.query);

            const result = await storageService.listChildren(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                parentId,
                {
                    page: parsedQuery.page,
                    limit: parsedQuery.limit,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Folder children fetched successfully",
                data: result,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async renameNode(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.id;
            const parsedBody = renameNodeSchema.parse(req.body);

            const updatedNode = await storageService.renameNode(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                nodeId,
                {
                    name: parsedBody.name,
                }
            );

            return res.status(200).json({
                success: true,
                message: "Node renamed successfully",
                data: updatedNode,
            });
        } catch (error) {
            return next(error);
        }
    }

    public async deleteNode(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedReq = req as AuthenticatedRequest;
            const nodeId = req.params.id;

            const deletedNode = await storageService.deleteNode(
                {
                    userId: authenticatedReq.user.userId,
                    role: authenticatedReq.user.role,
                },
                nodeId
            );

            return res.status(200).json({
                success: true,
                message: "Node deleted successfully",
                data: deletedNode,
            });
        } catch (error) {
            return next(error);
        }
    }
}

export const storageController = new StorageController();