import type { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { prisma } from "../common/prisma";
import { AppError } from "../common/errors/app-error";

const adminService = new AdminService(prisma);

export class AdminController {
    public async getRecentShares(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as Request & { user: { role: string } }).user;
            if (user.role !== "ADMIN") {
                throw new AppError("Forbidden", 403, "FORBIDDEN");
            }
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 5;
            const result = await adminService.getRecentShares(page, limit);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    public async getActivityFeed(req: Request, res: Response, next: NextFunction) {
        try {
            const user = (req as Request & { user: { role: string } }).user;
            if (user.role !== "ADMIN") {
                throw new AppError("Forbidden", 403, "FORBIDDEN");
            }
            const page = parseInt(req.query.page as string, 10) || 1;
            const limit = parseInt(req.query.limit as string, 10) || 10;
            const result = await adminService.getActivityFeed(page, limit);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}

export const adminController = new AdminController();
