import express, { Request, Response } from "express";
import * as videoController from "../controllers/video.controller";
import {
  protectAuthenticated,
  protectRole,
} from "../middlewares/session.middleware";

const router = express.Router();

router.get(
  "/",
  [protectAuthenticated, protectRole(["ROLE_USER"])],
  videoController.getVideos
);
router.get(
  "/:id/download",
  [protectAuthenticated, protectRole(["ROLE_USER"])],
  videoController.downloadVideo
);
router.get(
  "/:id/stream",
  [protectAuthenticated, protectRole(["ROLE_USER"])],
  videoController.streamVideo
);

router.post(
  "/",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  videoController.addVideo
);

router.put(
  "/:id",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  videoController.updateVideo
);

export default router;
