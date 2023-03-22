import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import UserModel from "../database/models/user.model";

declare module "express" {
  interface Authorization {
    token: string;
    authenticated: boolean;
    uid: string;
  }
  interface Request {
    authorization?: Authorization;
  }
}

export function protectAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.authorization) {
    return res.sendStatus(401);
  }

  if (!req.authorization.authenticated) {
    return res.sendStatus(401);
  }

  return next();
}

export function protectRole(roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.authorization) {
      return res.sendStatus(401);
    }

    const uid = req.authorization?.uid;

    if (!uid) {
      return res.sendStatus(401);
    }
    const _user = await UserModel.findOne({ _id: uid, roles: { $in: roles } });
    if (!_user) {
      return res.sendStatus(401);
    }

    next();
  };
}

export function verifyDownloadToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.query.token?.toString();
    if (!token) {
      return res.sendStatus(400);
    }
    jwt.verify(token, process.env.JWT_SECRET || "dev");
  } catch (error: any) {
    return res.sendStatus(403);
  }

  return next();
}

export default async function session(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const token = req.header("authorization")?.replace("Bearer ", "");
  if (!token) {
    return next();
  }
  try {
    const decoded: jwt.JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev"
    ) as jwt.JwtPayload;
    const user = await UserModel.findOne({ sessionToken: token });

    if (!user) {
      return next();
    }
    req.authorization = {
      token: token,
      authenticated: true,
      uid: decoded.id,
    };
  } catch (error: any) {
    return next();
  }
  next();
}
