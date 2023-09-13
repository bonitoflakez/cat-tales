import express from "express";

import { authVerification } from "../controllers/authVerification.controller";

const router = express.Router();

router.post("/auth", authVerification);

export default router;
