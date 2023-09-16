import { Request, Response } from "express";
import pool from "../models/db";

export const getPlayerProfile = (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    return res.status(403).json({
      message: "Username missing",
    });
  }

  const fetchPlayerProfileData = async () => {
    try {
      const playerQuery =
        "SELECT p.*, c.coins FROM players p LEFT JOIN currency c ON p.user_id = c.user_id WHERE p.username = $1";
      const playerValues = [username];
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

  fetchPlayerProfileData();
};
