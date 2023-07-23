import { Request, Response } from "express";
import pool from "../models/db";

export const getPlayerProfile = async (req: Request, res: Response) => {
  try {
    const { playerId } = req.params;
    const playerQuery = "SELECT * FROM players WHERE id = $1";
    const playerValues = [playerId];
    const playerResult = await pool.query(playerQuery, playerValues);

    if (playerResult.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    const player = playerResult.rows[0];
    return res.status(200).json(player);
  } catch (err) {
    console.error("Error fetching player profile:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
