import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const authVerification = async (req: Request, res: Response) => {
  try {
    const token = req.body.token;

    if (token) {
      const decode = jwt.verify(token, process.env.SECRET as Secret);

      res.json({
        authStatus: "Successful",
        data: decode,
      });
    } else {
      res.json({
        authStatus: "Failed",
        data: "ERROR",
      });
    }
  } catch (error) {
    console.error("Error: ", error);
    return res.status(403).json({
      message: "Some error occured while verifying auth tokens",
    });
  }
};
