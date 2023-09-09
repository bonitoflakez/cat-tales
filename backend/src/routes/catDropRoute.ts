import express from "express";
import { dropRandomCat, adoptCat } from "../controllers/catDrop.controller";

const router = express.Router();

router.post("/drop", dropRandomCat);
router.post("/adopt", adoptCat);

export default router;
