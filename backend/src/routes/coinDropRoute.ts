import express from "express";

import { dropDailyCoins } from "../controllers/coinDrop.controller";

const router = express.Router();

router.post("/coins", dropDailyCoins);

export default router;
