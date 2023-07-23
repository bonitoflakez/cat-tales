import express from "express";
import playerRoutes from "./playerRoute";
import catDropRoutes from "./catDropRoute";
import itemRoutes from "./itemsRoute";
import authRoutes from "./authRoute";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/cat", catDropRoutes);
router.use("/item", itemRoutes);
router.use("/player", playerRoutes);

export default router;
