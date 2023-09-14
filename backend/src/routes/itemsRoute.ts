import express from "express";
import { addDropItemToInventory } from "../controllers/itemDrop.controller";
import verifyToken from "../middleware/tokenVerify";

const router = express.Router();

router.post("/add", verifyToken, addDropItemToInventory);

export default router;
