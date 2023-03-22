import express from "express";
import * as userController from "../controllers/user.controller";
import {
  protectAuthenticated,
  protectRole,
} from "../middlewares/session.middleware";

const router = express.Router();

router.get("/", protectAuthenticated, userController.getCurrentUser);

router.get(
  "/all",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  userController.getUsers
);

router.post(
  "/logout",
  [protectAuthenticated, protectRole(["ROLE_ADMIN", "ROLE_USER"])],
  userController.createUser
);

router.post(
  "/",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  userController.createUser
);

router.delete(
  "/:id",
  [protectAuthenticated, protectRole(["ROLE_ADMIN"])],
  userController.deleteUser
);

export default router;
