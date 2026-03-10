import { Router } from "express";
import { sharingController } from "./sharing.controller";
import { authenticate } from "../common/middleware/auth";

const sharingRouter = Router();

sharingRouter.post(
  "/",
  authenticate,
  sharingController.createShare.bind(sharingController)
);

sharingRouter.get(
  "/shared-with-me",
  authenticate,
  sharingController.getSharedWithMe.bind(sharingController)
);

sharingRouter.get(
  "/node/:nodeId",
  authenticate,
  sharingController.listSharesForNode.bind(sharingController)
);

sharingRouter.patch(
  "/:id",
  authenticate,
  sharingController.updateShare.bind(sharingController)
);

sharingRouter.delete(
  "/:id",
  authenticate,
  sharingController.deleteShare.bind(sharingController)
);

export { sharingRouter };