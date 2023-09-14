import express from "express";
import {
  buyStoreItem,
  getStoreItems,
} from "../controllers/storeItem.controller";
import verifyToken from "../middleware/tokenVerify";
const router = express.Router();

router.get("/getItems", getStoreItems);
router.post("/buyItem", verifyToken, buyStoreItem);

export default router;
