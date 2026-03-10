import { Router } from "express";
import { searchController } from "./search.controller";
import { authenticate } from "@/common";

const searchRouter = Router();

searchRouter.get(
    "/",
    authenticate,
    searchController.search.bind(searchController)
);

export { searchRouter };
