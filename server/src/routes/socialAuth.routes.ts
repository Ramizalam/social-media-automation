import express, { Router } from "express";
import { generateAuthUrl, syncAccounts } from "../controllers/socialAuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const socialAuthRouter = Router();

socialAuthRouter.get("/:platform/url",protect,generateAuthUrl);
socialAuthRouter.get("/sync",protect,syncAccounts);

export default socialAuthRouter;