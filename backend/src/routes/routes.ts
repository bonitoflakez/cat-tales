import express from "express";
import playerRoutes from "./playerRoute";
import catDropRoutes from "./catDropRoute";
import itemRoutes from "./itemsRoute";
import authRoutes from "./authRoute";
import storeRoutes from "./storeRoute";
import coinDropRoutes from "./coinDropRoute";
import authVerificationRoutes from "./authVerificationRoute";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cat", catDropRoutes);
router.use("/item", itemRoutes);
router.use("/player", playerRoutes);
router.use("/store", storeRoutes);
router.use("/daily", coinDropRoutes);
router.use("/verify", authVerificationRoutes);

export default router;
