import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface JwtPayload {
  id: string;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user_id?: string;
    }
  }
}

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const authHeaderToken = req.header("Authorization");

    if (!authHeaderToken || !authHeaderToken.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    const token = authHeaderToken.substring(7);

    const decode = jwt.verify(
      token,
      process.env.SECRET as Secret
    ) as JwtPayload;

    if (!decode.id) {
      return res.status(403).json({
        message: "Faulty auth token!",
      });
    }

    return res.status(201).json({
      authStatus: "Successful",
      authToken: decode,
    });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid token",
    });
  }
};

export default verifyToken;
