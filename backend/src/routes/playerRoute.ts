import express from "express";
import { getCatDetails } from "../controllers/cat.controller";
import { getPlayerProfile } from "../controllers/player.controller";
import { getItemDetails, useItem } from "../controllers/item.controller";
import verifyToken from "../middleware/tokenVerify";

const router = express.Router();

router.get("/getPlayerCat/:userId", verifyToken, getCatDetails);
router.get("/getPlayer/:username", verifyToken, getPlayerProfile);
router.get("/getPlayerItem/:userId", verifyToken, getItemDetails);
router.post("/useItem", verifyToken, useItem);

export default router;
