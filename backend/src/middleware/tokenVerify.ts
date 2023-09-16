import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface JwtPayload {
  id: string;
  token: string;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeaderToken = req.header("Authorization");

  if (!authHeaderToken?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  const token = authHeaderToken.substring(7);

  const verifyTokenAsync = async () => {
    try {
      const decode = (await jwt.verify(
        token,
        process.env.SECRET as Secret
      )) as JwtPayload;

      if (!decode.id) {
        return res.status(403).json({
          message: "Faulty auth token!",
        });
      }

      if (decode.exp && Date.now() >= decode.exp * 1000) {
        return res.status(401).json({
          message: "Token expired",
        });
      }

      next();
    } catch (error) {
      console.error("JWT verification error:", error);
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  };

  verifyTokenAsync();
};

export default verifyToken;
