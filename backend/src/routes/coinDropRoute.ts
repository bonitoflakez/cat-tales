import express from "express";

import {
  dropDailyCoins,
  claimRewardCoins,
} from "../controllers/coinDrop.controller";

const router = express.Router();

router.post("/check", dropDailyCoins);
router.post("/claim", claimRewardCoins);

export default router;
