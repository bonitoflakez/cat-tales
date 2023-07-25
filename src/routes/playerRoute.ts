import express from "express";
import { getCatDetails } from "../controllers/catController";
import { getPlayerProfile } from "../controllers/playerController";
import { getItemDetails } from "../controllers/itemController";
import { useItem } from "../controllers/itemController";

const router = express.Router();

router.get("/getPlayerCat/:userId", getCatDetails);
router.get("/getPlayer/:username", getPlayerProfile);
router.get("/getPlayerItem/:userId", getItemDetails);
router.post("/useItem", useItem);

export default router;
