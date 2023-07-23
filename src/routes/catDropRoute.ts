import express from "express";
import { dropRandomCat, adoptCat } from "../controllers/catDropController";

const router = express.Router();

router.get("/dropRandom", dropRandomCat);
router.post("/adopt", adoptCat);

export default router;
