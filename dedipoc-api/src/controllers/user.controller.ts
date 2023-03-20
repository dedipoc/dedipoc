import { Request, Response } from "express";
import UserModel from "../database/models/user.model";
import jwt from "jsonwebtoken";

export async function getCurrentUser(req: Request, res: Response) {
  try {
    const uid = req.session.uid;
    if (!uid) {
      req.session.destroy(() => {});
      throw new Error("Missing uid from cookie.");
    }
    const user = await UserModel.findById(uid);
    if (!user) {
      req.session.destroy(() => {});
      throw new Error("Could not find user");
    }
    return res.json({
      id: user._id,
      username: user.username,
      roles: user.roles,
      token: jwt.sign(
        {
          id: user._id,
          username: user.username,
          roles: user.roles,
        },
        "gloireapatrick"
      ),
    });
  } catch (error: any) {
    res.status(401).json({ message: error.toString() });
    return;
  }
}

export async function createUser(req: Request, res: Response) {
  const { username, password, roles } = req.body;
  try {
    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
      res.sendStatus(409);
      return;
    }
    let user = new UserModel({
      username,
      password,
      roles,
    });

    user = await user.save();
    res.sendStatus(200);
  } catch (error: any) {
    res.status(501).json({ message: error.toString() });
    return;
  }
}
