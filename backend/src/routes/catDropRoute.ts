import express from "express";
import verifyToken from "../middleware/tokenVerify";
import { dropRandomCat, adoptCat } from "../controllers/catDrop.controller";

const router = express.Router();

router.post("/drop", verifyToken, dropRandomCat);
router.post("/adopt", verifyToken, adoptCat);

export default router;
