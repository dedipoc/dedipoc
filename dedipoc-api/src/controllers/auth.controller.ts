import { Request, Response } from "express";
import UserModel from "../database/models/user.model";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";

export async function updatePassword(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;

  if (!id) {
    logger.error(`Update password error for user ${id}`);
    return res.status(400).json({ message: `Missing parameter "id".` });
  }
  if (!password) {
    logger.error(`Update password error for user ${id}`);
    return res.status(400).json({ message: `Missing parameter "password".` });
  }

  try {
    const dbUser = await UserModel.findById(id);

    if (!dbUser) {
      logger.error(`Update password error for user ${id}`);
      return res
        .status(400)
        .json({ message: `Could not find user with id ${id}` });
    }

    dbUser.password = password;

    await dbUser.save();
  } catch (error: any) {
    logger.error("Failed to update password", error);
    return res.status(400).json({ message: `Failed to update password` });
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "username and password required." });
    return;
  }

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      throw new Error("Invalid username.");
    }
    if (!user.matchPassword || !(await user.matchPassword(password))) {
      throw new Error("Invalid password.");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "dev", {
      expiresIn: "1d",
    });

    user.sessionToken = token;
    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      roles: user.roles,
      token: token,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.toString() });
    return;
  }
}

export async function logout(req: Request, res: Response) {
  const token = req.authorization?.token;
  if (!token) {
    return res.sendStatus(200);
  }
  const user = await UserModel.findOne({ sessionToken: token });
  if (!user) {
    return res.sendStatus(200);
  }
  user.sessionToken = null;
  await user.save();
}
