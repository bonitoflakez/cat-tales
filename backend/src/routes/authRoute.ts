import express, { Request, Response } from "express";
import saveUser from "../middleware/userCheck";
import { login, signUp } from "../controllers/userAuth.controller";
import verifyToken from "../middleware/tokenVerify";

const router = express.Router();

router.post("/login", login, verifyToken);
router.post("/signup", saveUser, signUp);

export default router;
