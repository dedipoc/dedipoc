import { NextFunction, Request, Response } from "express";
import session, { SessionOptions } from "express-session";
import MongoStore from "connect-mongo";

import * as config from "../config";
import connectDb from "../database/connection";
import UserModel from "../database/models/user.model";

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    uid: string;
    roles: string[];
  }
}

const store = MongoStore.create({
  clientPromise: connectDb(),
  touchAfter: 24 * 3600,
  crypto: {
    secret: config.storeSecret,
  },
});

export const alwaysAllow = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next();
};

export const protectAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authenticated } = req.session;
  if (!authenticated) {
    return res.sendStatus(401);
  }
  next();
};

export const protectRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { uid } = req.session;

    if (!uid) {
      return res.sendStatus(401);
    }
    const _user = UserModel.findOne({ _id: uid, roles: { $in: roles } });
    if (!_user) {
      return res.sendStatus(401);
    }

    next();
  };
};

const sessionOption: SessionOptions = {
  name: "dedipoc",
  secret: config.sessionSecret,
  cookie: {
    maxAge: 30 * 86400 * 1000,
  },
  resave: false,
  saveUninitialized: false,
  store,
  unset: "destroy",
};

if (config.environment === "production") {
  if (sessionOption.cookie) {
    sessionOption.cookie.secure = true;
    // sessionOption.cookie.httpOnly = false;
  }
}

const sessionMiddleware = session(sessionOption);

export default sessionMiddleware;
