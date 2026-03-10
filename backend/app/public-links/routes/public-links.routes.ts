import { Router } from "express";
import { publicLinksController } from "../controllers/public-links.controller";
import { authenticate } from "../../common/middleware/auth";

const router = Router();

// --- Admin Endpoints (Authenticated & Role Checked in Service) ---
router.post("/public-links", authenticate, publicLinksController.createPublicLink.bind(publicLinksController));
router.get("/public-links/node/:nodeId", authenticate, publicLinksController.listPublicLinksForNode.bind(publicLinksController));
router.patch("/public-links/:id/revoke", authenticate, publicLinksController.revokePublicLink.bind(publicLinksController));

// --- Anonymous Public Endpoints (No Auth Required) ---
router.get("/public/:token", publicLinksController.publicGetNode.bind(publicLinksController));
router.get("/public/:token/children", publicLinksController.publicListChildren.bind(publicLinksController));
router.get("/public/:token/breadcrumbs", publicLinksController.publicGetBreadcrumbs.bind(publicLinksController));
router.get("/public/:token/file-access-url", publicLinksController.publicGetFileAccessUrl.bind(publicLinksController));
router.get("/public/:token/files/:nodeId/access-url", publicLinksController.publicGetChildFileAccessUrl.bind(publicLinksController));

export { router as publicLinksRoutes };
