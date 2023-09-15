import express from "express";

import {
  dropDailyCoins,
  claimRewardCoins,
} from "../controllers/coinDrop.controller";
import verifyToken from "../middleware/tokenVerify";

const router = express.Router();

router.post("/check", verifyToken, dropDailyCoins);
router.post("/claim", verifyToken, claimRewardCoins);

export default router;
