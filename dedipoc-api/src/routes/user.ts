import express, { Request, Response } from "express";
import * as userController from "../controllers/user.controller";
import {
  protectAuthenticated,
  protectRole,
} from "../middlewares/session.middleware";

const router = express.Router();

router.get("/", protectAuthenticated, userController.getCurrentUser);
router.post(
  "/logout",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  userController.createUser
);

export default router;
