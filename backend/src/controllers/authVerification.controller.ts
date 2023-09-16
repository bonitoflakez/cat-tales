import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const authVerification = (req: Request, res: Response) => {
  const token = req.body.token;

  if (!token) {
    return res.status(403).json({
      authStatus: "Failed",
      data: "ERROR",
    });
  }

  const verify = async () => {
    try {
      const decode = jwt.verify(token, process.env.SECRET as Secret);

      res.json({
        authStatus: "Successful",
        data: decode,
      });
    } catch (error) {
      console.error("Error: ", error);
      return res.status(403).json({
        message: "Some error occured while verifying auth tokens",
      });
    }
  };

  verify();
};
