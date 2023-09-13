import express from "express";
import { addDropItemToInventory } from "../controllers/itemDrop.controller";

const router = express.Router();

router.post("/add", addDropItemToInventory);

export default router;
