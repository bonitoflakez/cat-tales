import express from "express";
import playerRoutes from "./playerRoute";
import catDropRoutes from "./catDropRoute";
import itemRoutes from "./itemsRoute";
import authRoutes from "./authRoute";
import storeRoutes from "./storeRoute";
import coinDropRoutes from "./coinDropRoute";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cat", catDropRoutes);
router.use("/item", itemRoutes);
router.use("/player", playerRoutes);
router.use("/store", storeRoutes);
router.use("/daily", coinDropRoutes);

export default router;
