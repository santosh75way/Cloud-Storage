import authRoutes from "@/auth/auth.routes";
import { storageRouter } from "@/sotorage/storage.routes";
import { Router } from "express";
import { sharingRouter } from "./sharing/sharing.routes";
import { publicLinksRoutes } from "./public-links/routes/public-links.routes";
import { adminRouter } from "./admin/admin.routes";
import { searchRouter } from "./search/search.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/storage", storageRouter);
router.use("/shares", sharingRouter);
router.use("/admin", adminRouter);
router.use("/v1/search", searchRouter);
router.use("/", publicLinksRoutes);
export default router;