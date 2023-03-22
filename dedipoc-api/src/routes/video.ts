import express from "express";
import * as videoController from "../controllers/video.controller";
import {
  protectAuthenticated,
  protectRole,
  verifyDownloadToken,
} from "../middlewares/session.middleware";

const router = express.Router();

router.get(
  "/",
  [protectAuthenticated, protectRole(["ROLE_ADMIN", "ROLE_USER"])],
  videoController.getVideos
);

router.get(
  "/:id/download",
  // [protectAuthenticated, protectRole(["ROLE_ADMIN", "ROLE_USER"])],
  [verifyDownloadToken],
  videoController.downloadVideo
);

router.get(
  "/:id/stream",
  [protectAuthenticated, protectRole(["ROLE_ADMIN", "ROLE_USER"])],
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

router.get(
  "/dl-token",
  [protectAuthenticated],
  videoController.getDownloadToken
);

router.post("/explore", videoController.explore);

export default router;
