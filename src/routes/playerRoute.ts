import express from "express";
import { getCatDetails } from "../controllers/cat.controller";
import { getPlayerProfile } from "../controllers/player.controller";
import { getItemDetails } from "../controllers/item.controller";
import { useItem } from "../controllers/item.controller";

const router = express.Router();

router.get("/getPlayerCat/:userId", getCatDetails);
router.get("/getPlayer/:username", getPlayerProfile);
router.get("/getPlayerItem/:userId", getItemDetails);
router.post("/useItem", useItem);

export default router;
