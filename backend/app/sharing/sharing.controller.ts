import type { NextFunction, Request, Response } from "express";
import { sharingService } from ".";
import { createShareSchema, updateShareSchema } from "./sharing.schemas";

type AuthenticatedRequestUser = {
  userId: string;
  role: "ADMIN" | "USER";
};

type AuthenticatedRequest = Request & {
  user: AuthenticatedRequestUser;
};

export class SharingController {
  public async createShare(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const parsedBody = createShareSchema.parse(req.body);

      const share = await sharingService.createShare(
        {
          userId: authenticatedReq.user.userId,
          role: authenticatedReq.user.role,
        },
        {
          nodeId: parsedBody.nodeId,
          sharedWithUserId: parsedBody.sharedWithUserId,
          permission: parsedBody.permission,
        }
      );

      return res.status(201).json({
        success: true,
        message: "Node shared successfully",
        data: share,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async listSharesForNode(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const nodeId = req.params.nodeId;

      const shares = await sharingService.listSharesForNode(
        {
          userId: authenticatedReq.user.userId,
          role: authenticatedReq.user.role,
        },
        nodeId
      );

      return res.status(200).json({
        success: true,
        message: "Shares fetched successfully",
        data: shares,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async getSharedWithMe(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedReq = req as AuthenticatedRequest;

      const sharedItems = await sharingService.getSharedWithMe({
        userId: authenticatedReq.user.userId,
        role: authenticatedReq.user.role,
      });

      return res.status(200).json({
        success: true,
        message: "Shared items fetched successfully",
        data: sharedItems,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async updateShare(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const shareId = req.params.id;
      const parsedBody = updateShareSchema.parse(req.body);

      const share = await sharingService.updateShare(
        {
          userId: authenticatedReq.user.userId,
          role: authenticatedReq.user.role,
        },
        shareId,
        {
          permission: parsedBody.permission,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Share updated successfully",
        data: share,
      });
    } catch (error) {
      return next(error);
    }
  }

  public async deleteShare(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedReq = req as AuthenticatedRequest;
      const shareId = req.params.id;

      const deletedShare = await sharingService.deleteShare(
        {
          userId: authenticatedReq.user.userId,
          role: authenticatedReq.user.role,
        },
        shareId
      );

      return res.status(200).json({
        success: true,
        message: "Share removed successfully",
        data: deletedShare,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const sharingController = new SharingController();