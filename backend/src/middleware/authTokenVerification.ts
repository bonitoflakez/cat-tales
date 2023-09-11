import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secretKey } from "../controllers/userAuth.controller";

interface CustomRequest extends Request {
  user?: any;
}

export const authTokenVerification = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Access Denied",
    });
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
    req.user = user;
    next();
  });
};
