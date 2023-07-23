import express from "express";
import {
  dropRandomItem,
  addDropItemToInventory,
} from "../controllers/itemDrop";

const router = express.Router();

router.get("/dropRandom", dropRandomItem);
router.post("/add", addDropItemToInventory);

export default router;
