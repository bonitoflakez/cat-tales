import express from "express";
import { login, signUp } from "../controllers/userAuth.controller";
import saveUser from "../middleware/userCheck";

const router = express.Router();

router.post("/login", login);
router.post("/signup", saveUser, signUp);

export default router;
