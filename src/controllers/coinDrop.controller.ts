import { Request, Response } from "express";
import pool from "../models/db";

interface coins {
  amount: number;
}

function getRandCoins(): number {
  return Math.floor(Math.random() * 100);
}

export const dropDailyCoins = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { user_id } = req.body;

    await client.query("BEGIN");

    const userQuery = "SELECT user_id FROM players WHERE user_id = $1";
    const userValue = [user_id];
    const userResult = await client.query(userQuery, userValue);

    if (userResult.rowCount === 0 || !user_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Invalid user",
      });
    }

    const coins: coins = {
      amount: getRandCoins(),
    };

    return res.status(200).json(coins);
  } catch (err) {
    console.error("Error getting coins amount:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
};
