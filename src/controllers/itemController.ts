import { Request, Response } from "express";
import pool from "../models/db";

export const getItemDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const itemQuery = "SELECT * FROM items WHERE user_id = $1";
    const itemOwnerValue = [userId];
    const itemDetailsResult = await pool.query(itemQuery, itemOwnerValue);

    if (itemDetailsResult.rowCount === 0) {
      return res.status(404).json({ message: "This owner has no items!!??" });
    }

    const items = itemDetailsResult.rows;
    return res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching item details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
