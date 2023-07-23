import express from "express";
import { getCatDetails } from "../controllers/catController";
import { getPlayerProfile } from "../controllers/playerController";

const router = express.Router();

router.get("/getPlayerCat/:catOwnerId", getCatDetails);
router.get("/getPlayer/:playerId", getPlayerProfile);

export default router;
