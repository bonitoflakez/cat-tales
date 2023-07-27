import express from "express";
import {
  buyStoreItem,
  getStoreItems,
} from "../controllers/storeItem.controller";
const router = express.Router();

router.get("/getItems", getStoreItems);
router.post("/buyItem", buyStoreItem);

export default router;
