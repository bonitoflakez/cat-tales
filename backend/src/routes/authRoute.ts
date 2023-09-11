import express from "express";
import { Request, Response } from "express";

import { login, signUp } from "../controllers/userAuth.controller";

import saveUser from "../middleware/userCheck";
import { authTokenVerification } from "../middleware/authTokenVerification";

interface CustomRequest extends Request {
  user?: any;
}

const router = express.Router();

router.post(
  "/login",
  login,
  authTokenVerification,
  (req: CustomRequest, res: Response) => {
    res.json({ message: "Authenticated route", user: req.user });
  }
);
router.post("/signup", saveUser, signUp);

export default router;
