import express, { Request, Response } from "express";
import saveUser from "../middleware/userCheck";
import { login, signUp } from "../controllers/userAuth.controller";

const router = express.Router();

router.post("/login", login);
router.post("/signup", saveUser, signUp);

export default router;
