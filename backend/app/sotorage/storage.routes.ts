import { Router } from "express";
import { storageController } from "./storage.controller";

import { authenticate, authorize } from "@/common";
import { uploadSignatureLimiter } from "@/common/middleware/rateLimiter";

const storageRouter = Router();

storageRouter.post(
    "/folders",
    authenticate,
    storageController.createFolder.bind(storageController)
);

storageRouter.post(
    "/uploads/sign",
    authenticate,
    uploadSignatureLimiter,
    storageController.generateUploadSignature.bind(storageController)
);

storageRouter.post(
    "/files",
    authenticate,
    storageController.createFileNode.bind(storageController)
);

storageRouter.get(
    "/root/children",
    authenticate,
    storageController.listRootChildren.bind(storageController)
);

storageRouter.get(
    "/:id/children",
    authenticate,
    storageController.listFolderChildren.bind(storageController)
);

storageRouter.get(
    "/:id/breadcrumbs",
    authenticate,
    storageController.getBreadcrumbs.bind(storageController)
);

storageRouter.get(
    "/:id/access-url",
    authenticate,
    storageController.getFileAccessUrl.bind(storageController)
);

storageRouter.get(
    "/:id",
    authenticate,
    storageController.getNodeById.bind(storageController)
);

storageRouter.patch(
    "/:id/rename",
    authenticate,
    storageController.renameNode.bind(storageController)
);

storageRouter.delete(
    "/:id",
    authenticate,
    storageController.deleteNode.bind(storageController)
);

export { storageRouter };