import express from "express";
import { addDropItemToInventory } from "../controllers/itemDrop.controller";

const router = express.Router();

// router.get("/dropRandom", dropRandomItem);
router.post("/add", addDropItemToInventory);

export default router;
