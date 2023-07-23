import { Request, Response } from "express";
import pool from "../models/db";

export const getCatDetails = async (req: Request, res: Response) => {
  try {
    const { catOwnerId } = req.params;
    const catQuery = "SELECT * FROM cats WHERE ownerid = $1";
    const catOwnerValue = [catOwnerId];
    const catDetailsResult = await pool.query(catQuery, catOwnerValue);

    if (catDetailsResult.rowCount === 0) {
      return res.status(404).json({ message: "This owner has no cats!!??" });
    }

    const cats = catDetailsResult.rows;
    return res.status(200).json(cats);
  } catch (err) {
    console.error("Error fetching cat details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
