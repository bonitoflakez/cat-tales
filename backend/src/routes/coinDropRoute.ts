import express from "express";

import verifyToken from "../middleware/tokenVerify";

import {
  dropDailyCoins,
  claimRewardCoins,
} from "../controllers/coinDrop.controller";

const router = express.Router();

router.post("/check", verifyToken, dropDailyCoins);
router.post("/claim", verifyToken, claimRewardCoins);

export default router;
