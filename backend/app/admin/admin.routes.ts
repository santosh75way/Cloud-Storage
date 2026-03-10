import { Router } from "express";
import { adminController } from "./admin.controller";
import { authenticate } from "../common/middleware/auth";

const adminRouter = Router();

adminRouter.get("/shares/recent", authenticate, adminController.getRecentShares.bind(adminController));
adminRouter.get("/activity", authenticate, adminController.getActivityFeed.bind(adminController));

export { adminRouter };
